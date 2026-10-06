import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "sm" | "md";

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-green-700 text-paper hover:bg-green-900",
  secondary:
    "border border-rule-strong bg-paper-raised text-ink hover:border-green-700 hover:bg-green-50 hover:text-green-900",
  text: "text-green-700 underline decoration-terracotta-600 decoration-1 underline-offset-[3px] hover:text-green-900 hover:decoration-2",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-small",
  md: "h-10 px-5 text-body",
};

export interface ButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    ButtonSharedProps {}

export interface ButtonLinkProps
  extends
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">,
    ButtonSharedProps {
  href: string;
}

interface ButtonSharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return cn(
    baseClasses,
    variantClasses[variant],
    variant !== "text" && sizeClasses[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  type,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(buttonClasses(variant, size, className), "no-underline")}
      {...props}
    >
      {children}
    </a>
  );
}
