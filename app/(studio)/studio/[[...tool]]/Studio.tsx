"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * Client-only wrapper so the Sanity config (and the whole Studio bundle) never
 * enters the React Server Components graph, where Turbopack cannot resolve
 * some of its dependencies (swr has no default export under react-server).
 */
export function Studio() {
  return <NextStudio config={config} />;
}
