"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/papers", label: "Papers" },
  { href: "/topics", label: "Topics" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export interface NavLinksProps {
  /** Distinguish multiple nav landmarks (e.g. "Main" vs "Menu"). */
  ariaLabel?: string;
  className?: string;
  onNavigate?: () => void;
  /** Editorial display size for the full-screen menu. */
  large?: boolean;
}

export function NavLinks({
  ariaLabel = "Main",
  className,
  onNavigate,
  large = false,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul
        className={cn(
          large ? "flex flex-col items-start gap-6" : "flex items-center gap-7",
          "m-0 list-none p-0",
        )}
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  "no-underline transition-colors",
                  large
                    ? cn(
                        "font-serif text-h3",
                        active
                          ? "text-green-900"
                          : "text-ink hover:text-green-900",
                      )
                    : cn(
                        "text-small",
                        active
                          ? "font-medium text-green-900 underline decoration-terracotta-600 decoration-[1.5px] underline-offset-[6px]"
                          : "text-ink-soft hover:text-green-900",
                      ),
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
