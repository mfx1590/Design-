// Crawls every URL in the per-locale sitemaps and checks the launch metadata (PLAN.md §12):
// status 200, title, description, canonical equal to the URL, hreflang for six locales + x-default,
// og:image, one h1, JSON-LD that parses. Usage: node scripts/check-seo.mjs [base-url]
const base = (process.argv[2] || "http://localhost:3000").replace(/\/+$/, "");
const locales = ["en", "pl", "ru", "tr", "fa", "de"];

async function urlsFor(locale) {
  const xml = await fetch(`${base}/sitemap/${locale}.xml`).then((r) => r.text());
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function attr(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&") : null;
}

let siteOrigin = "";
let failures = 0;
let checked = 0;
const seenTitles = new Map();
for (const locale of locales) {
  const urls = await urlsFor(locale);
  if (!siteOrigin && urls[0]) siteOrigin = new URL(urls[0]).origin;
  for (const url of urls) {
    const res = await fetch(url.replace(siteOrigin, base));
    const html = await res.text();
    const problems = [];
    if (res.status !== 200) problems.push(`status ${res.status}`);
    const title = attr(html, /<title>([^<]*)<\/title>/);
    if (!title) problems.push("no title");
    else if (title.length > 70) problems.push(`title ${title.length} chars`);
    const description = attr(html, /<meta name="description" content="([^"]*)"/);
    if (!description) problems.push("no description");
    else if (description.length > 170) problems.push(`description ${description.length} chars`);
    const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
    if (canonical !== url) problems.push(`canonical ${canonical}`);
    const hreflangs = (html.match(/<link rel="alternate" hrefLang="/gi) || []).length;
    if (hreflangs !== locales.length + 1) problems.push(`hreflang ${hreflangs}`);
    if (!/property="og:image"/.test(html)) problems.push("no og:image");
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) problems.push(`${h1s} h1`);
    const lang = attr(html, /<html lang="([^"]*)"/);
    if (lang !== locale) problems.push(`lang ${lang}`);
    for (const block of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
      try {
        JSON.parse(block[1]);
      } catch {
        problems.push("invalid JSON-LD");
      }
    }
    if (title) {
      const key = `${locale}:${title}`;
      if (seenTitles.has(key)) problems.push(`duplicate title of ${seenTitles.get(key)}`);
      else seenTitles.set(key, url);
    }
    checked += 1;
    if (problems.length) {
      failures += 1;
      console.log(`FAIL ${url}: ${problems.join("; ")}`);
    }
  }
}
console.log(`\n${checked} URLs checked, ${failures} with problems`);
process.exit(failures ? 1 : 0);
