import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-(--content-max) px-(--gutter)", className)}>{children}</div>;
}
