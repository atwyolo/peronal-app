import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

/**
 * Architecture boundaries (adapted Feature-Sliced Design), see docs/specs/2026-10-29-home-page-design.md.
 * Imports are resolved by the TypeScript resolver that eslint-config-next already configures,
 * so the `@/*` alias works here without extra settings.
 */
const architecture = {
  files: ["src/**/*.{ts,tsx}"],
  plugins: { boundaries },
  settings: {
    // Order matters: the first matching descriptor wins, so specific paths go first.
    "boundaries/elements": [
      { type: "app", pattern: "src/app", partialMatch: false },
      { type: "view", pattern: "src/views/*", partialMatch: false, capture: ["slice"] },
      { type: "widget", pattern: "src/widgets/*", partialMatch: false, capture: ["slice"] },
      { type: "feature", pattern: "src/features/*", partialMatch: false, capture: ["slice"] },
      { type: "shadcn", pattern: "src/shared/shadcn", partialMatch: false },
      { type: "shared", pattern: "src/shared/*", partialMatch: false, capture: ["segment"] },
      { type: "db", pattern: "src/db", partialMatch: false },
      { type: "actions", pattern: "src/actions", partialMatch: false },
      { type: "schemas", pattern: "src/schemas", partialMatch: false },
    ],
  },
  rules: {
    // Every file in src/ must belong to a layer.
    "boundaries/no-unknown-files": "error",
    "boundaries/dependencies": [
      "error",
      {
        default: "disallow",
        // Also check packages (not only local files), for the @base-ui rule below.
        // Imports inside the same element (slice internals) are never checked.
        checkAllOrigins: true,
        // Policies are evaluated in order; the last matching one wins.
        policies: [
          // Packages and Node built-ins are allowed everywhere...
          { allow: { to: { module: { origin: ["external", "core"] } } } },
          // ...except the UI primitives library, which only generated shadcn code may touch.
          {
            from: { element: { type: "!shadcn" } },
            disallow: { to: { module: { source: "@base-ui/**" } } },
          },

          // Layer order. Imports into a slice of views/widgets/features go through its
          // public files only: files in the slice root, never lib/, model/ or ui/ subfolders.
          {
            from: { element: { type: "app" } },
            allow: [
              { to: { element: { type: "view", fileInternalPath: "*" } } },
              { to: { element: { type: "shared" } } },
            ],
          },
          {
            from: { element: { type: "view" } },
            allow: [
              { to: { element: { types: { anyOf: ["widget", "feature"] }, fileInternalPath: "*" } } },
              { to: { element: { types: { anyOf: ["shared", "db"] } } } },
            ],
          },
          {
            from: { element: { type: "widget" } },
            allow: [
              { to: { element: { type: "feature", fileInternalPath: "*" } } },
              { to: { element: { types: { anyOf: ["shared", "db"] } } } },
            ],
          },
          // Features get data as props; they may only borrow types from db.
          {
            from: { element: { type: "feature" } },
            allow: [
              { to: { element: { type: "shared" } } },
              { to: { element: { type: "db" } }, dependency: { kind: "type" } },
            ],
          },
          // shared/ui is the only consumer of generated shadcn code.
          {
            from: { element: { type: "shared", captured: { segment: "ui" } } },
            allow: { to: { element: { type: "shadcn" } } },
          },
          {
            from: { element: { types: { anyOf: ["shared", "shadcn", "db"] } } },
            allow: { to: { element: { type: "shared", captured: { segment: "lib" } } } },
          },

          // Server Actions and Zod schemas sit outside the layers with no import-order rules:
          // any file may import them, and they may import any local file.
          { allow: { to: { element: { types: { anyOf: ["actions", "schemas"] } } } } },
          {
            from: { element: { types: { anyOf: ["actions", "schemas"] } } },
            allow: { to: { element: { isUnknown: false } } },
          },
        ],
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  architecture,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
