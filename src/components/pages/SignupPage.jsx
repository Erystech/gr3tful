import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
 
export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      // Supabase sends a confirmation email by default.
      // Navigate to login with a success note.
      navigate("/login?confirmed=true");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-fwhite flex items-center justify-center p-6 font-parag">
      

      <div className="w-full max-w-105 animate-fade-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-3xl mb-2">✦</div>
          <h1 className="font-heading text-4xl text-darkb tracking-[-1px] mb-2">
            Start your practice
          </h1>
          <p className="text-[14px] text-secondary-text italic">
            Three things a day. That's all it takes.
          </p>
        </div>

        {/* Card */}
        <div className="bg-fwhite  border border-borderline rounded-3xl py-9 px-8">
          {/* Email */}
          <div className="mb-4">
            <label className="block text-[12px] text-secondary-text uppercase tracking-[1.5px] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full box-border bg-fwhite border border-borderline rounded-xl py-3 px-3.5 font-parag text-[14px] text-darkb"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-[12px] text-secondary-text uppercase tracking-[1.5px] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full box-border bg-fwhite border border-borderline rounded-xl py-3 px-3.5 font-parag text-[14px] text-darkb"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-[12px] text-secondary-text uppercase tracking-[1.5px] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleSignup()}
              className="w-full box-border bg-fwhite border border-borderline rounded-xl py-3 px-3.5 font-parag text-[14px] text-darkb"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-secondary-bg border border-borderline rounded-xl py-2.5 px-3.5 mb-5 text-[13px] text-red-700" >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSignup}
            disabled={loading || !email || !password || !confirm}
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
        </div>

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