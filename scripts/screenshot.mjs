// Checkpoint screenshots via the Chrome DevTools Protocol (no extra downloads).
// Usage:  pnpm shots <out-dir> <base-url> en pl fa ...   (paths may omit the leading slash; from Git Bash set MSYS_NO_PATHCONV=1 if you use slashes)
//         FULL=1 ...            captures the full page height instead of the viewport.
//         SCROLL=0,300,900 ...  captures once per scroll offset (px), suffixing files with -y<offset>.
//         EVAL_FILE=<file.js>    evaluates the expression in the page for each viewport and prints the result instead of capturing.
// Writes <out-dir>/<path>-desktop.png (1440x900) and <path>-mobile.png (390x844 @2x, touch).
// Chrome's plain --screenshot flag clamps small windows on Windows, so this emulates a device instead.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import http from "node:http";
import { join } from "node:path";

const CANDIDATES = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);
const CHROME = CANDIDATES.find((p) => existsSync(p));
if (!CHROME) throw new Error("No Chrome or Edge executable found; set CHROME=<path>");

const [outDir, base, ...rawPaths] = process.argv.slice(2);
// Accept "en" as well as "/en" (Git Bash rewrites leading-slash args into Windows paths).
const paths = rawPaths.map((p) => (p.startsWith("/") ? p : "/" + p));
if (!outDir || !base || paths.length === 0) {
  console.error("usage: screenshot.mjs <out-dir> <base-url> <path> [<path> ...]");
  process.exit(1);
}

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
};
const SCROLLS = (process.env.SCROLL || "0").split(",").map(Number);
const FULL = Boolean(process.env.FULL);

const port = 9300 + Math.floor(Math.random() * 500);
const profile = join(process.env.TEMP || "/tmp", "chrome-shots-profile");
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const getJSON = (url) =>
  new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve(JSON.parse(body)));
      })
      .on("error", reject);
  });

async function waitForChrome() {
  for (let i = 0; i < 100; i++) {
    try {
      return await getJSON(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  throw new Error("Chrome did not start");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Set();
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const l of this.listeners) l(msg);
      }
    };
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  once(method) {
    return new Promise((resolve) => {
      const l = (msg) => {
        if (msg.method === method) {
          this.listeners.delete(l);
          resolve(msg.params);
        }
      };
      this.listeners.add(l);
    });
  }
  async eval(expression) {
    const { result } = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    return result?.value;
  }
}

const fileName = (p, vp, suffix) => `${p.replace(/^\//, "").replace(/\//g, "_") || "root"}-${vp}${suffix}.png`;

(async () => {
  await waitForChrome();
  const targets = await getJSON(`http://127.0.0.1:${port}/json/list`);
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  const cdp = new CDP(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  mkdirSync(outDir, { recursive: true });

  for (const p of paths) {
    for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
      await cdp.send("Emulation.setDeviceMetricsOverride", vp);
      await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: vp.mobile });
      const loaded = cdp.once("Page.loadEventFired");
      await cdp.send("Page.navigate", { url: base + p });
      await loaded;
      await cdp.eval("document.fonts.ready.then(() => true)");
      await sleep(800);

      if (process.env.EVAL_FILE) {
        const value = await cdp.eval(readFileSync(process.env.EVAL_FILE, "utf8"));
        console.log(`${p} @ ${vpName}: ${JSON.stringify(value, null, 1)}`);
        continue;
      }

      for (const y of SCROLLS) {
        if (y > 0) {
          await cdp.eval(`window.scrollTo(0, ${y}); true`);
          // Give smooth scrolling, scroll-driven scenes and lazy images time to settle.
          await sleep(1800);
        }
        if (FULL) {
          // Walk the page so lazy images and scroll-driven content load, then grow the viewport to fit.
          await cdp.eval("(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); return true; })()");
          await sleep(1200);
          const { contentSize } = await cdp.send("Page.getLayoutMetrics");
          const height = Math.ceil(contentSize.height);
          await cdp.send("Emulation.setDeviceMetricsOverride", { ...vp, height });
          await sleep(800);
        }
        // The viewport now covers the whole page, so a plain capture works in LTR and RTL alike.
        const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
        const suffix = SCROLLS.length > 1 ? `-y${y}` : "";
        const file = join(outDir, fileName(p, vpName, suffix));
        writeFileSync(file, Buffer.from(data, "base64"));
        console.log(file);
      }
    }
  }
  ws.close();
  chrome.kill();
})().catch((err) => {
  console.error(err);
  chrome.kill();
  process.exit(1);
});
