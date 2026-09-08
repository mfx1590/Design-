import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Locale-aware Link / router / pathname helpers. Use these, never next/link or next/navigation directly. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
