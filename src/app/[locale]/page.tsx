// Rendering: static, one page per locale. Every read in the view is a "use cache" function, so the whole page joins the static shell at build time.
// Route files stay thin: the page composition and its metadata live in src/views (see docs/specs/2026-10-29-home-page-design.md).
export { HomePage as default } from "@/views/home/HomePage";
export { generateMetadata } from "@/views/home/metadata";
