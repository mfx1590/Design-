// Compares messages/<locale>.json with messages/en.json: same keys, same ICU placeholders and tags.
// Usage: node scripts/check-messages.mjs pl [ru tr fa de]   (no args = all locales)
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]):/, "$1:");
const en = JSON.parse(readFileSync(join(root, "messages", "en.json"), "utf8"));
const locales = process.argv.slice(2).length ? process.argv.slice(2) : ["pl", "ru", "tr", "fa", "de"];

function leaves(obj, prefix = "", out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") leaves(v, key, out);
    else out.set(key, v);
  }
  return out;
}

// Placeholders: {name} and {name, plural/select ...}; tags: <b>, </b>
function placeholders(s) {
  const found = new Set();
  for (const m of String(s).matchAll(/\{\s*([A-Za-z0-9_]+)/g)) found.add(m[1]);
  return [...found].sort().join(",");
}
function tags(s) {
  return [...String(s).matchAll(/<\/?([a-z]+)>/g)].map((m) => m[0]).sort().join(",");
}

const enLeaves = leaves(en);
let failed = false;
for (const locale of locales) {
  const target = JSON.parse(readFileSync(join(root, "messages", `${locale}.json`), "utf8"));
  const tl = leaves(target);
  const missing = [...enLeaves.keys()].filter((k) => !tl.has(k));
  const extra = [...tl.keys()].filter((k) => !enLeaves.has(k));
  const empty = [...tl].filter(([, v]) => typeof v !== "string" || !v.trim()).map(([k]) => k);
  const badPlaceholders = [...tl].filter(([k, v]) => enLeaves.has(k) && placeholders(v) !== placeholders(enLeaves.get(k))).map(([k]) => k);
  const badTags = [...tl].filter(([k, v]) => enLeaves.has(k) && tags(v) !== tags(enLeaves.get(k))).map(([k]) => k);
  const same = [...tl].filter(([k, v]) => enLeaves.has(k) && v === enLeaves.get(k) && !/^(brand\.|areas\.|meta\.)/.test(k) && /[a-z]{4,}/i.test(v) && !/^(WhatsApp|Design Package|Studio|1\+1|2\+1)$/.test(v)).map(([k]) => k);
  const problems = { missing, extra, empty, badPlaceholders, badTags };
  const count = Object.values(problems).reduce((n, a) => n + a.length, 0);
  console.log(`\n== ${locale}: ${tl.size}/${enLeaves.size} keys, ${count} problem(s), ${same.length} identical to English`);
  for (const [name, list] of Object.entries(problems)) if (list.length) console.log(`  ${name} (${list.length}):`, list.slice(0, 40).join(", "), list.length > 40 ? "…" : "");
  if (same.length) console.log(`  identical to English (${same.length}):`, same.slice(0, 30).join(", "), same.length > 30 ? "…" : "");
  if (count) failed = true;
}
console.log(failed ? "\nFAILED" : "\nOK");
process.exit(failed ? 1 : 0);
