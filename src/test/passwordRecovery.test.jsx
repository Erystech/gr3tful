import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ForgotPasswordPage from "../components/pages/ForgotPasswordPage";
import ResetPasswordPage from "../components/pages/ResetPasswordPage";

const {
  resetPasswordForEmail,
  updateUser,
  getSession,
  unsubscribe,
} = vi.hoisted(() => ({
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  getSession: vi.fn(),
  unsubscribe: vi.fn(),
}));

vi.mock("../supabaseClient", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail,
      updateUser,
      getSession,
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe } } })),
    },
  },
}));

vi.mock("../components/ThemeToggle", () => ({
  default: () => <button type="button">Theme</button>,
}));

describe("password recovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPasswordForEmail.mockResolvedValue({ error: null });
    updateUser.mockResolvedValue({ error: null });
    getSession.mockResolvedValue({ data: { session: { user: { id: "user-1" } } } });
  });

  it("requests a reset link without revealing whether the account exists", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ForgotPasswordPage /></MemoryRouter>);

    await user.type(screen.getByLabelText("Email"), "person@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    await waitFor(() => expect(resetPasswordForEmail).toHaveBeenCalledWith(
      "person@example.com",
      expect.objectContaining({ redirectTo: expect.stringContaining("/reset-password") })
    ));
    expect(screen.getByRole("status")).toHaveTextContent("If an account exists");
  });

  it("updates the password from a valid recovery session", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/reset-password"]}>
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/entry" element={<p>Entry page</p>} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByLabelText("New password");
    await user.type(screen.getByLabelText("New password"), "new-password-123");
    await user.type(screen.getByLabelText("Confirm password"), "new-password-123");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    await waitFor(() => expect(updateUser).toHaveBeenCalledWith({ password: "new-password-123" }));
    expect(await screen.findByText("Entry page")).toBeInTheDocument();
  });
});
