import { cn } from "@/src/lib/cn";
import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-content px-6 md:px-10", className)}>{children}</div>;
}
