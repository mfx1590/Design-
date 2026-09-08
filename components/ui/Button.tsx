import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "tertiary" | "inverse";
type Size = "sm" | "md" | "lg";

const base = "inline-flex items-center justify-center gap-2 font-medium no-underline transition-colors duration-(--dur-ui) ease-soft";

const variants: Record<Variant, string> = {
  primary: "border-[1.5px] border-frame bg-frame text-plaster hover:border-walnut hover:bg-walnut",
  secondary: "border-[1.5px] border-frame bg-transparent text-ink hover:bg-porcelain",
  tertiary: "link font-normal",
  /** For use over photography and on Frame surfaces. */
  inverse: "border-[1.5px] border-plaster bg-transparent text-plaster hover:bg-plaster hover:text-frame",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-2 text-small",
  md: "px-5 py-3 text-body",
  lg: "px-6 py-4 text-lead",
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

/**
 * Primary: Frame fill. Secondary: Frame outline. Tertiary: text link with a Kyrenia underline.
 * Inverse: Plaster outline for use over photos. No arrows, no icons by default, zero radius.
 */
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
