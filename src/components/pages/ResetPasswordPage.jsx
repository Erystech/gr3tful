import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ThemeToggle from "../ThemeToggle";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasSession, setHasSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) setHasSession(Boolean(session));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && (event === "PASSWORD_RECOVERY" || session)) setHasSession(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handlePasswordUpdate(event) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don’t match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    navigate("/entry", { replace: true });
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-parag transition-colors duration-300">
      <ThemeToggle className="fixed right-5 top-5" />
      <div className="w-full max-w-105 animate-fade-slide-up">
        <div className="mb-8 text-center">
          <div className="mb-2 text-3xl">✦</div>
          <h1 className="mb-2 font-heading text-4xl text-darkb">Choose a new password</h1>
        </div>

        <div className="rounded-3xl border border-borderline bg-surface px-8 py-9">
          {hasSession === null && <p className="text-center text-sm italic text-secondary-text">Checking your reset link…</p>}
          {hasSession === false && (
            <div className="text-center">
              <p role="alert" className="mb-5 text-sm leading-6 text-secondary-text">This reset link is invalid or has expired.</p>
              <Link to="/forgot-password" className="font-semibold text-secondary">Request a new link</Link>
            </div>
          )}
          {hasSession && (
            <form onSubmit={handlePasswordUpdate}>
              <label htmlFor="new-password" className="mb-2 block text-xs uppercase tracking-[1.5px] text-secondary-text">New password</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mb-4 w-full rounded-xl border border-borderline bg-surface px-5 py-3.5 text-sm text-darkb"
              />
              <label htmlFor="confirm-new-password" className="mb-2 block text-xs uppercase tracking-[1.5px] text-secondary-text">Confirm password</label>
              <input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mb-4 w-full rounded-xl border border-borderline bg-surface px-5 py-3.5 text-sm text-darkb"
              />
              {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full rounded-2xl bg-secondary p-3.5 font-heading font-bold italic text-fwhite disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
