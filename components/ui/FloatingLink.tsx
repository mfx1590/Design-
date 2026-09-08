"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";

interface FloatingLinkProps {
  href: string;
  /** Element id whose visibility hides the floating link (it already offers the same action). */
  hideNear?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}

/** Fixed link that steps aside while a given section is on screen. */
export function FloatingLink({ href, hideNear, className, children, ariaLabel }: FloatingLinkProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!hideNear) return;
    const target = document.getElementById(hideNear);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hideNear]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={cx(className, "transition-[opacity,transform] duration-(--dur-ui) ease-soft", hidden && "pointer-events-none translate-y-3 opacity-0")}
    >
      {children}
    </a>
  );
}
