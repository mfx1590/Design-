import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

/**
 * Privacy-preserving analytics (PLAN.md §11 Phase 5), off by default. Both options are cookieless
 * and collect no personal data, so no consent banner is needed for them:
 *   NEXT_PUBLIC_ANALYTICS=vercel      Vercel Web Analytics (only works on Vercel hosting)
 *   NEXT_PUBLIC_ANALYTICS=plausible   Plausible; also set NEXT_PUBLIC_PLAUSIBLE_DOMAIN=example.com
 */
export function Analytics() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS;
  if (provider === "vercel") return <VercelAnalytics />;
  if (provider === "plausible" && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    return <script defer data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" />;
  }
  return null;
}
