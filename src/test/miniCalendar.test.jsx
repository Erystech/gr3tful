import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MiniCalendar from "../components/Journal/MiniCalendar";

describe("MiniCalendar favorite days", () => {
  it("shows a heart for a favorite entry and opens that date", () => {
    const onSelect = vi.fn();
    render(
      <MiniCalendar
        entries={[{ date: "2026-10-05", isFavorite: true }]}
        selectedDate={null}
        onSelect={onSelect}
      />
    );

    const favoriteDate = screen.getByRole("button", {
      name: "Open favorite gratitude entry for 2026-10-05",
    });
    expect(screen.getByText("♥")).toBeInTheDocument();

    fireEvent.click(favoriteDate);
    expect(onSelect).toHaveBeenCalledWith("2026-10-05");
  });

  it("keeps the regular marker and label for a non-favorite entry", () => {
    render(
      <MiniCalendar
        entries={[{ date: "2026-10-04", isFavorite: false }]}
        selectedDate={null}
        onSelect={() => {}}
      />
    );

    expect(screen.getByRole("button", {
      name: "Open gratitude entry for 2026-10-04",
    })).toBeInTheDocument();
    expect(screen.queryByText("♥")).not.toBeInTheDocument();
  });
});
