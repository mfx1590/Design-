import type { ReactNode } from "react";

/** Separate root layout for the Sanity Studio: no locale routing, no site chrome. */
export default function StudioRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
