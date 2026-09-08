import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cx } from "@/lib/cx";

const control =
  "w-full border border-umber bg-espresso px-4 py-3.5 text-body text-ivory transition-colors duration-(--dur-ui) ease-soft placeholder:text-ink-muted hover:border-sand/60 focus:border-brass focus:outline-none aria-[invalid=true]:border-terracotta disabled:opacity-40";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

/** Label above, control, then hint or error below. Labels are always visible (no placeholder-only labels). */
export function Field({ label, htmlFor, hint, error, children, className }: FieldProps) {
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-small font-medium tracking-[0.02em] text-sand">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-small text-terracotta-text">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-small text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(control, className)} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(control, "min-h-36 resize-y", className)} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cx(control, "control-select appearance-none", className)}>
      {children}
    </select>
  );
}

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cx("inline-flex cursor-pointer items-start gap-3 text-small text-sand", className)}>
      <input id={id} type="checkbox" {...props} className="control-checkbox mt-1 shrink-0" />
      <span>{label}</span>
    </label>
  );
}
