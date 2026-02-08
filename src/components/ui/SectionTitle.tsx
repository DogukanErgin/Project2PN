import { cn } from "@/src/lib/cn";
import { ReactNode } from "react";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  kicker?: ReactNode;
  className?: string;
};

export function SectionTitle({ title, subtitle, align = "left", kicker, className }: SectionTitleProps) {
  return (
    <header className={cn("space-y-3", align === "center" ? "text-center" : "text-left", className)}>
      {kicker ? <p className="text-xs uppercase tracking-[0.2em] text-fog">{kicker}</p> : null}
      <h2 className="font-display text-3xl tracking-tight text-cream md:text-4xl">{title}</h2>
      {subtitle ? <p className="max-w-2xl text-sm text-fog md:text-base">{subtitle}</p> : null}
    </header>
  );
}
