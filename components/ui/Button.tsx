"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "next/link";

type Variant = "primary" | "secondary" | "text";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold select-none " +
  "transition-all duration-[120ms] ease-out " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60 " +
  "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-primary text-white hover:bg-accent-pressed active:bg-accent-pressed shadow-card",
  secondary:
    "bg-surface text-text-primary border border-border-soft hover:border-accent-secondary",
  text: "bg-transparent text-accent-primary hover:bg-accent-primary/5",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[14px] rounded-button min-w-[44px]",
  lg: "h-14 px-6 text-[15px] rounded-button min-w-[44px]",
};

function classes(variant: Variant, size: Size, fullWidth: boolean, extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? "w-full" : ""
  } ${extra}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={classes(variant, size, fullWidth, className)}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps extends Omit<LinkProps, "as"> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link {...rest} className={classes(variant, size, fullWidth, className)}>
      {children}
    </Link>
  );
}
