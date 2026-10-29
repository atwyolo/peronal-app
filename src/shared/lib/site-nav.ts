/**
 * Main navigation of the public site, shared by the header and the mobile menu.
 * `key` selects the label in messages (`Header.nav.<key>`); `href` is the path without the locale.
 * Pages that do not exist yet lead to the 404 page until they are built (owner's decision).
 */
export const siteNav = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "projects", href: "/projects" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;
