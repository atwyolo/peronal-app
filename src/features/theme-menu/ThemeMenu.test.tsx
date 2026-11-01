import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import messages from "../../../messages/en.json";
import { ThemeMenu } from "./ThemeMenu";

const theme = vi.hoisted(() => ({
  theme: "system",
  resolvedTheme: "dark",
  systemTheme: "dark",
  setTheme: vi.fn(),
}));

vi.mock("next-themes", () => ({ useTheme: () => theme }));

const renderMenu = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeMenu />
    </NextIntlClientProvider>,
  );

describe("ThemeMenu", () => {
  beforeEach(() => {
    theme.setTheme.mockClear();
  });

  it("shows the resolved theme's icon on the trigger", () => {
    renderMenu();

    const trigger = screen.getByRole("button", { name: "Theme" });
    expect(trigger.querySelector(".lucide-moon")).not.toBeNull();
  });

  it("offers dark, light and system, with the current OS theme as a hint", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: "Theme" }));

    expect((await screen.findAllByRole("menuitemradio")).map((item) => item.textContent)).toEqual([
      "Dark",
      "Light",
      "Systemnow dark",
    ]);
    expect(screen.getByRole("menuitemradio", { name: /System/ })).toHaveAttribute("aria-checked", "true");
  });

  it("switches the theme", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: "Theme" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "Light" }));

    expect(theme.setTheme).toHaveBeenCalledWith("light");
  });
});
