import type { ComponentPropsWithRef, FC } from "react";

import { cn } from "@/shared/lib/utils";
import { Button as ShadcnButton } from "@/shared/shadcn/ui/button";

// Full state set per tone (hover, open menu): the shadcn "default" variant underneath only brings bg/hover
// utilities, which these replace; variants like "outline" add aria-expanded/dark rules that would win instead.
const tones = {
  default: "border-card-border bg-card text-foreground hover:bg-accent aria-expanded:bg-accent",
  brand: "border-card-border bg-card text-brand hover:bg-accent aria-expanded:bg-accent",
  primary: "border-primary bg-primary text-primary-foreground hover:bg-primary/85",
  /** Carousel arrows; `aria-disabled` instead of `disabled` keeps the keyboard focus, and the focus ring is not dimmed. */
  outline:
    "border-brand bg-transparent text-brand hover:bg-accent aria-disabled:pointer-events-none aria-disabled:not-focus-visible:opacity-35",
} as const;

const shapes = {
  pill: "h-11 px-[18px]",
  circle: "size-11 p-0",
  /** Header controls: a 44px round icon button on mobile, a pill from lg. */
  "circle-to-pill": "size-11 p-0 lg:w-auto lg:px-3.5",
} as const;

export interface ButtonLookProps {
  tone?: keyof typeof tones;
  shape?: keyof typeof shapes;
  /** Layout only (margins, grid placement); colors and sizes come from `tone` and `shape`. */
  className?: string;
}

interface ButtonProps extends Omit<ComponentPropsWithRef<"button">, "className">, ButtonLookProps {}

/** The design's look on top of the shadcn base, shared with ButtonLink. */
export const getButtonClasses = (look: ButtonLookProps): string => {
  const { tone = "default", shape = "pill", className } = look;

  return cn(
    // The solid `ring` color: the 50% of the shadcn default falls under 3:1 on a light surface.
    // `outline-hidden`, not shadcn's `outline-none`: forced colors drop the box-shadow ring and show this outline instead.
    "gap-2 rounded-full text-[15px] font-medium outline-hidden focus-visible:ring-ring [&_svg:not([class*='size-'])]:size-[18px]",
    tones[tone],
    shapes[shape],
    className,
  );
};

/**
 * Our button in design terms (pills and round icon buttons, 44px touch target), over the shadcn Button.
 * Spreads the remaining props, so it also works as a Menu trigger (aria-expanded, ref, handlers).
 * For a link with this look see ButtonLink: this file stays free of routing, so a plain button needs no router.
 */
export const Button: FC<ButtonProps> = (props) => {
  const { tone, shape, className, ...rest } = props;

  return <ShadcnButton variant="default" className={getButtonClasses({ tone, shape, className })} {...rest} />;
};
