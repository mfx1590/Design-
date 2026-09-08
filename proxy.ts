import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/** Locale detection + redirect (PLAN.md §8). Runs on every page request. */
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, the Sanity Studio, Next/Vercel internals and files with an extension.
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
