import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "tertiary" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-[0.04em] no-underline transition-colors duration-(--dur-ui) ease-soft";

const variants: Record<Variant, string> = {
  /** Brass fill, night text. The one call to action per view. */
  primary: "border border-brass bg-brass text-night hover:border-brass-deep hover:bg-brass-deep",
  /** Ivory outline that fills on hover. */
  secondary: "border border-ink/60 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-surface",
  /** Text link with a brass underline. */
  tertiary: "link font-normal tracking-normal",
  /** Same as secondary; kept for callers that sit over photography. */
  inverse: "border border-ink/60 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-surface",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-small",
  md: "px-7 py-3.5 text-body",
  lg: "px-8 py-4 text-lead",
};

type InternalHref = ComponentProps<typeof Link>["href"];

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  (
    | { href: InternalHref; external?: false; onClick?: never; type?: never; disabled?: never }
    | { href: string; external: true; onClick?: never; type?: never; disabled?: never }
    | { href?: never; external?: never; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }
  );

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cx(base, variants[variant], variant === "tertiary" ? "" : sizes[size], className);

  if (props.href !== undefined && props.external) {
    return (
      <a href={props.href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} disabled={props.disabled} className={cx(classes, "disabled:opacity-40")}>
      {children}
    </button>
  );
}
