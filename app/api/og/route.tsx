import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import en from "@/messages/en.json";
import { isLocale, localeMeta, type Locale } from "@/i18n/locales";

export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };
const PHOTO = path.join(process.cwd(), "public", "images", "projects", "project-01-studio", "after-landscape.jpg");
// An old Safari UA makes Google Fonts return a single TrueType file, which Satori can read.
const OLD_UA = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

async function googleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`, { headers: { "User-Agent": OLD_UA } }).then((r) => r.text());
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

async function messagesFor(locale: Locale): Promise<typeof en> {
  if (locale === "en") return en;
  try {
    const m = (await import(`@/messages/${locale}.json`)).default as Partial<typeof en>;
    return { ...en, ...m, brand: { ...en.brand, ...m.brand }, trust: { ...en.trust, ...m.trust }, meta: { ...en.meta, ...m.meta } } as typeof en;
  } catch {
    return en;
  }
}

/**
 * Default share image (PLAN.md §9): the furnished studio, a dusk scrim, the wordmark in Cormorant and
 * the price line in the requested locale. /api/og?locale=xx. Pages with a real photo use that instead.
 */
export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("locale") ?? "en";
  const locale: Locale = isLocale(requested) ? requested : "en";
  const m = await messagesFor(locale);
  const rtl = localeMeta[locale].dir === "rtl";

  const [photo, display, body, persian] = await Promise.all([
    readFile(PHOTO),
    googleFont("Cormorant Garamond", 500),
    googleFont("Jost", 400),
    rtl ? googleFont("Vazirmatn", 400) : Promise.resolve(null),
  ]);
  const fonts = [
    display ? { name: "Cormorant", data: display, weight: 500 as const, style: "normal" as const } : null,
    body ? { name: "Jost", data: body, weight: 400 as const, style: "normal" as const } : null,
    persian ? { name: "Vazirmatn", data: persian, weight: 400 as const, style: "normal" as const } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);
  const bodyFamily = rtl && persian ? "Vazirmatn" : "Jost";
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#14110d", direction: rtl ? "rtl" : "ltr" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain elements */}
        <img src={photoSrc} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(180deg, rgba(20,17,13,0) 22%, rgba(20,17,13,0.78) 58%, rgba(20,17,13,0.97) 100%)" }} />
        <div style={{ position: "absolute", left: 64, right: 64, bottom: 56, display: "flex", flexDirection: "column", gap: 14, color: "#f3ead9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 2, background: "#c9a45c" }} />
            <span style={{ fontFamily: bodyFamily, fontSize: rtl ? 26 : 22, letterSpacing: rtl ? 0 : 4, textTransform: rtl ? "none" : "uppercase", color: "#c9a45c" }}>{m.meta.title.split(" — ")[0]}</span>
          </div>
          <span style={{ fontFamily: "Cormorant", fontSize: 92, lineHeight: 1, letterSpacing: -1 }}>{m.brand.name}</span>
          <span style={{ fontFamily: bodyFamily, fontSize: 28, color: "#e6dcc8" }}>{m.trust.prices}</span>
        </div>
      </div>
    ),
    { ...SIZE, fonts, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800" } },
  );
}
