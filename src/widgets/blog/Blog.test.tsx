import { describe, expect, it, vi } from "vitest";
import { Blog } from "./Blog";

// The rest of the block is database-backed and lives in e2e/home-blog.spec.ts. Its data cannot be emptied there.
vi.mock("@/db/queries/home", () => ({ getLatestPosts: async () => [] }));
vi.mock("next-intl/server", () => ({
  getLocale: async () => "en",
  getTranslations: async () => (key: string) => key,
}));
// next-intl navigation needs the Next router.
vi.mock("@/shared/lib/i18n/navigation", () => ({ Link: () => null }));

describe("Blog", () => {
  it("renders nothing when no post is published", async () => {
    expect(await Blog({})).toBeNull();
  });
});
