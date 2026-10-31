import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import messages from "../../../messages/en.json";
import { SkillRow } from "./SkillRow";

const renderRow = (level: number) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SkillRow skill={{ name: "React", level }} />
    </NextIntlClientProvider>,
  );

describe("SkillRow", () => {
  it("shows the name and the level", () => {
    renderRow(9);

    expect(screen.getByText("React")).toBeVisible();
    expect(screen.getByText("9/10")).toBeVisible();
  });

  it("reports the level to a screen reader as a meter", () => {
    renderRow(9);

    const meter = screen.getByRole("meter", { name: "React: level 9 of 10" });

    expect(meter).toHaveAttribute("aria-valuenow", "9");
    expect(meter).toHaveAttribute("aria-valuemin", "1");
    expect(meter).toHaveAttribute("aria-valuemax", "10");
    expect(meter).toHaveAttribute("aria-valuetext", "9/10");
  });

  it.each([1, 7, 10])("fills %i of ten segments", (level) => {
    renderRow(level);

    const meter = screen.getByRole("meter");

    expect(meter.querySelectorAll(".bg-brand")).toHaveLength(level);
    expect(meter.querySelectorAll(".bg-placeholder")).toHaveLength(10 - level);
  });
});
