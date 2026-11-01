"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { FC, ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Workaround for next-themes 0.4.6 under React 19 (development only): React reports every <script> it creates on the
 * client ("Encountered a script tag..."), and next-themes renders its anti-flash script inside the component tree.
 * React skips script data blocks, so on the client the script gets a non-JavaScript type. On the server it stays a
 * normal script, which runs before paint; during hydration React reuses that server element, so nothing changes.
 * The library sets suppressHydrationWarning on the script, which covers the `type` difference.
 * See docs/decisions/ADR-0008 Theme.md.
 */
const scriptProps = typeof window === "undefined" ? undefined : { type: "application/json" };

/** Theme via next-themes: `.dark`/`.light` class on <html>, follows the OS until the visitor picks a theme. */
export const ThemeProvider: FC<ThemeProviderProps> = (props) => {
  const { children } = props;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // Switching themes must not animate every color transition on the page at once.
      disableTransitionOnChange
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
};
