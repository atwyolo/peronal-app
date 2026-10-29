import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Menu } from "./Menu";

const items = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System", hint: "now dark" },
];

const renderMenu = (onValueChange = vi.fn()) => {
  render(
    <Menu
      label="Theme"
      trigger={<button type="button">Open</button>}
      items={items}
      value="light"
      onValueChange={onValueChange}
    />,
  );
  return onValueChange;
};

describe("Menu", () => {
  it("lists the items as radio options with the current value checked", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: "Open" }));

    const menu = await screen.findByRole("menu", { name: "Theme" });
    expect(menu).toBeVisible();
    expect(screen.getAllByRole("menuitemradio").map((item) => item.textContent)).toEqual([
      "Dark",
      "Light",
      "Systemnow dark",
    ]);
    expect(screen.getByRole("menuitemradio", { name: /Light/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemradio", { name: /Dark/ })).toHaveAttribute("aria-checked", "false");
  });

  it("reports the picked value and closes", async () => {
    const user = userEvent.setup();
    const onValueChange = renderMenu();

    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(await screen.findByRole("menuitemradio", { name: /Dark/ }));

    expect(onValueChange).toHaveBeenCalledWith("dark");
    await vi.waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });
});
