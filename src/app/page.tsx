// Rendering: static. Every read in the view is a "use cache" function, so the whole page joins the static shell at build time.
// Route files stay thin: the page composition lives in src/views (see docs/specs/2026-10-29-home-page-design.md).
export { HomePage as default } from "@/views/home/HomePage";
