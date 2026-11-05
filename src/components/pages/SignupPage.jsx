import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ThemeToggle from "../ThemeToggle";
import { Eye, EyeOff } from "lucide-react";
import BrandLogo from "../BrandLogo";
import { MAX_NICKNAME_LENGTH, nicknameError, normalizeNickname } from "../utils/nickname";
 
export default function SignupPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    if (loading) return;
    setError(null);

    const invalidNickname = nicknameError(nickname);
    if (invalidNickname) {
      setError(invalidNickname);
      return;
    }

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname: normalizeNickname(nickname) } },
      });
      if (signupError) throw signupError;
      navigate("/login?confirmed=true");
    } catch (signupError) {
      setError(signupError.message || "Your account could not be created. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-parag transition-colors duration-300">
      <ThemeToggle className="fixed right-5 top-5" />
      

      <div className="w-full max-w-105 animate-fade-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/welcome" aria-label="Gr3tful home" className="mb-7 inline-block"><BrandLogo className="w-40" /></Link>
          <h1 className="font-heading text-4xl text-darkb tracking-[-1px] mb-2">
            Start your practice
          </h1>
          <p className="text-[14px] text-secondary-text italic">
            Three things a day. That's all it takes.
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSignup} className="bg-surface border border-borderline rounded-3xl py-9 px-8">
          <div className="mb-4">
            <label htmlFor="signup-nickname" className="mb-2 block text-[12px] uppercase tracking-[1.5px] text-secondary-text">What should we call you?</label>
            <input
              id="signup-nickname"
              name="nickname"
              type="text"
              autoComplete="nickname"
              required
              maxLength={MAX_NICKNAME_LENGTH}
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Your nickname"
              className="w-full box-border rounded-xl border border-borderline bg-surface px-3.5 py-3 font-parag text-[14px] text-darkb"
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="signup-email" className="block text-[12px] text-secondary-text uppercase tracking-[1.5px] mb-2">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full box-border bg-surface border border-borderline rounded-xl py-3 px-3.5 font-parag text-[14px] text-darkb"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="signup-password" className="block text-[12px] text-secondary-text uppercase tracking-[1.5px] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                autoComplete="new-password"
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full box-border bg-surface border border-borderline rounded-xl py-3 pl-3.5 pr-12 font-parag text-[14px] text-darkb"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-text hover:text-secondary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="signup-confirm-password" className="block text-[12px] text-secondary-text uppercase tracking-[1.5px] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="signup-confirm-password"
                autoComplete="new-password"
                required
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full box-border bg-surface border border-borderline rounded-xl py-3 pl-3.5 pr-12 font-parag text-[14px] text-darkb"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((visible) => !visible)}
                aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                aria-pressed={showConfirm}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-text hover:text-secondary"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="bg-secondary-bg border border-borderline rounded-xl py-2.5 px-3.5 mb-5 text-[13px] text-red-700" >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !nickname.trim() || !email || !password || !confirm}
            className="w-full p-3.5 rounded-2xl font-heading text-[16px] italic font-bold
              [background:linear-gradient(135deg,#C4622D,#E07B3A)]
              text-fwhite
              cursor-pointer
              transition-all
              duration-200
              disabled:[background:rgba(196,98,45,0.2)]
              disabled:text-secondary/50
              disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create account →"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[14px] text-secondary-text mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
