import type { FC, ReactNode } from "react";

import { Header } from "@/widgets/header/Header";

interface SiteLayoutProps {
  children: ReactNode;
}

/**
 * Frame shared by every public page (header now, footer later). Rendered by the root layout, so it stays mounted
 * across navigations; a view because `src/app` may only compose views.
 */
export const SiteLayout: FC<SiteLayoutProps> = (props) => {
  const { children } = props;

  return (
    <>
      <Header />
      {children}
    </>
  );
};
