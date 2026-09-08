import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import en from "../messages/en.json";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

/** Deep-merges locale messages over the English source so untranslated keys fall back to English (PLAN.md §8). */
function withEnglishFallback(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    if (value && typeof value === "object" && !Array.isArray(value) && current && typeof current === "object" && !Array.isArray(current)) {
      out[key] = withEnglishFallback(current as Messages, value as Messages);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages =
    locale === "en" ? en : withEnglishFallback(en as Messages, (await import(`../messages/${locale}.json`)).default as Messages);

  return {
    locale,
    messages: messages as typeof en,
    timeZone: "Asia/Nicosia",
  };
});
