export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** True once the owner has created the Sanity project and set the env vars. */
export const isSanityConfigured = projectId.length > 0;
