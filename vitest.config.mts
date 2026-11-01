import { defineConfig } from "vitest/config";

/**
 * Unit and component tests. Async Server Components are not supported by Vitest;
 * cover them with Playwright in e2e/ (Next.js testing guide).
 *
 * No @vitejs/plugin-react / vite-tsconfig-paths: Vite 8 compiles JSX with Oxc using
 * tsconfig's "jsx": "react-jsx", and resolves the `@/*` alias natively.
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
