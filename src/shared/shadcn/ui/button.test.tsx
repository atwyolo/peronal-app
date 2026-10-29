import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("calls onClick when the user clicks it", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Download CV</Button>);

    await user.click(screen.getByRole("button", { name: "Download CV" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not react when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Download CV
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Download CV" }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Download CV" })).toBeDisabled();
  });
});
