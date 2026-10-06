import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerWidth = "site" | "reading";

const widthClasses: Record<ContainerWidth, string> = {
  site: "max-w-site px-5 sm:px-8",
  reading: "max-w-[68ch] px-5 sm:px-8",
};

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  width?: ContainerWidth;
  children: ReactNode;
}

export function Container({
  as: Tag = "div",
  width = "site",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full", widthClasses[width], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
