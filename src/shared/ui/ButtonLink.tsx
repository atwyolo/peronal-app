import type { FC, ReactNode } from "react";

import { Link } from "@/shared/lib/i18n/navigation";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/shadcn/ui/button";

import { type ButtonLookProps, getButtonClasses } from "./Button";

interface ButtonLinkProps extends ButtonLookProps {
  /** A page of the site; the router adds the locale. */
  href: string;
  children: ReactNode;
}

/** A link that looks like our Button: navigation stays a real anchor, so it works before hydration and in a new tab. */
export const ButtonLink: FC<ButtonLinkProps> = (props) => {
  const { href, children, ...look } = props;

  return (
    <Link href={href} className={cn(buttonVariants({ variant: "default", className: getButtonClasses(look) }))}>
      {children}
    </Link>
  );
};
