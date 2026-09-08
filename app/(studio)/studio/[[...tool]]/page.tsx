import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./Studio";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", padding: "3rem", maxWidth: "40rem" }}>
        <h1>Sanity Studio is not configured yet</h1>
        <p>
          Create the Sanity project, then set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local (see .env.example) and
          restart the dev server.
        </p>
      </main>
    );
  }
  return <Studio />;
}
