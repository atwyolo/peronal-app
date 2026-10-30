import { ArrowUpRightIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

const tones = {
  whatsapp: "bg-whatsapp text-whatsapp-foreground",
  mail: "bg-gmail text-gmail-foreground",
  linkedin: "bg-linkedin text-linkedin-foreground",
  cv: "bg-primary text-primary-foreground",
} as const;

interface ContactLinkProps {
  href: string;
  /** Accessible name; it must contain the visible label. */
  label: string;
  /** Tooltip with the full address. */
  title?: string;
  tone: keyof typeof tones;
  /** Opens in a new tab: the visitor keeps the site open. */
  external?: boolean;
  /** Left mark: a logo or an icon. */
  mark: ReactNode;
  /** Right side, an arrow by default. */
  trailing?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Compact brand button of the contacts block: 56px tall, 16px radius.
 * Separate from shared/ui/Button: that one is a 44px pill in theme colors, this one exists only in this widget.
 */
export const ContactLink: FC<ContactLinkProps> = (props) => {
  const { href, label, title, tone, external, mark, className, children } = props;
  const { trailing = <ArrowUpRightIcon aria-hidden className="size-[18px] shrink-0 opacity-80" /> } = props;

  return (
    <a
      href={href}
      title={title}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "flex min-h-14 min-w-0 items-center gap-3 rounded-[16px] pr-4 pl-2.5 text-[17px] font-bold tracking-[-0.01em] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        tones[tone],
        className,
      )}
    >
      {mark}
      <span className="min-w-0 grow [overflow-wrap:anywhere]">{children}</span>
      {trailing}
    </a>
  );
};
