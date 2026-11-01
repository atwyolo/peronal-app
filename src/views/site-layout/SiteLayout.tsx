import type { FC, ReactNode } from "react";

import { RevealOnce } from "@/shared/ui/RevealOnce";
import { Header } from "@/widgets/header/Header";

interface SiteLayoutProps {
  children: ReactNode;
}

/**
 * Frame shared by every public page (the header; the site has no footer). Rendered by the root layout, so it stays mounted
 * across navigations, except a language switch, which remounts that layout; a view because `src/app` may only compose views.
 */
export const SiteLayout: FC<SiteLayoutProps> = (props) => {
  const { children } = props;

  return (
    <>
      <RevealOnce />
      <Header />
      {children}
    </>
  );
};
