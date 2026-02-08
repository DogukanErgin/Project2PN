import { cn } from "@/src/lib/cn";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: "solid" | "ghost";
  size?: "sm" | "md";
};

type AnchorProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "inline-flex items-center justify-center rounded-full border text-sm font-semibold tracking-wide transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<NonNullable<BaseProps["variant"]>, string> = {
  solid: "border-transparent bg-amber px-5 text-ink hover:bg-[#e3b57a]",
  ghost: "border-line bg-white/5 px-5 text-cream hover:border-amber/60 hover:bg-white/10"
};

const sizes: Record<NonNullable<BaseProps["size"]>, string> = {
  sm: "h-10 text-xs",
  md: "h-11"
};

export function Button(props: AnchorProps | NativeButtonProps) {
  const { children, className, variant = "solid", size = "md", ...rest } = props;
  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  if ("href" in props) {
    return (
      <a className={classes} {...(rest as AnchorProps)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as NativeButtonProps)}>
      {children}
    </button>
  );
}
