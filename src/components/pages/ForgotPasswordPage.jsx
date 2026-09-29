import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ThemeToggle from "../ThemeToggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResetRequest(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl.replace(/\/$/, "")}/reset-password`,
    });

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-parag transition-colors duration-300">
      <ThemeToggle className="fixed right-5 top-5" />
      <div className="w-full max-w-105 animate-fade-slide-up">
        <div className="mb-8 text-center">
          <div className="mb-2 text-3xl">✦</div>
          <h1 className="mb-2 font-heading text-4xl text-darkb">Reset your password</h1>
          <p className="text-sm italic text-secondary-text">We’ll email you a secure reset link.</p>
        </div>

        <form onSubmit={handleResetRequest} className="rounded-3xl border border-borderline bg-surface px-8 py-9">
          {sent ? (
            <div role="status" className="rounded-2xl border border-borderline bg-secondary/10 p-5 text-sm leading-6 text-secondary-text">
              If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your inbox and spam folder.
            </div>
          ) : (
            <>
              <label htmlFor="reset-email" className="mb-2 block text-xs uppercase tracking-[1.5px] text-secondary-text">Email</label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mb-4 w-full rounded-xl border border-borderline bg-surface px-5 py-3.5 text-sm text-darkb"
              />
              {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full rounded-2xl bg-secondary p-3.5 font-heading font-bold italic text-fwhite disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-secondary-text">
          <Link to="/login" className="font-semibold text-secondary">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
