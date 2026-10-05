import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../components/context/ThemeContext";
import LoginPage from "../components/pages/LoginPage";
import SignupPage from "../components/pages/SignupPage";

vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));

function renderPage(page) {
  return render(
    <ThemeProvider>
      <MemoryRouter>{page}</MemoryRouter>
    </ThemeProvider>
  );
}

describe("password visibility controls", () => {
  it("shows and hides the login password", () => {
    renderPage(<LoginPage />);
    const password = screen.getByPlaceholderText("••••••••");

    expect(password).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");
  });

  it("controls both signup password fields independently", () => {
    renderPage(<SignupPage />);
    const password = screen.getByPlaceholderText("Min. 8 characters");
    const confirmation = screen.getByPlaceholderText("••••••••");

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    expect(confirmation).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Show confirmation password" }));
    expect(confirmation).toHaveAttribute("type", "text");
  });
});
