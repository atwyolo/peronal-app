import { expect, test as base } from "@playwright/test";

interface ConsoleGuardOptions {
  /** Console errors a test expects, e.g. the browser's own log for an intentional 404. */
  allowedConsoleErrors: RegExp[];
}

/**
 * Shared `test`: fails any test whose page logs a console error or throws an uncaught exception.
 * Catches hydration mismatches (React reports them as console errors, minified in production builds).
 */
export const test = base.extend<ConsoleGuardOptions & { consoleGuard: void }>({
  allowedConsoleErrors: [[], { option: true }],
  consoleGuard: [
    async ({ page, allowedConsoleErrors }, use) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        const text = message.text();
        if (!allowedConsoleErrors.some((pattern) => pattern.test(text))) errors.push(text);
      });
      page.on("pageerror", (error) => errors.push(error.message));

      await use();

      expect(errors, "console errors on the page").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
