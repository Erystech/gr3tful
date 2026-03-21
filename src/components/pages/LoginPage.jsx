import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../Supabaseclient";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate("/entry");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-fwhite flex items-center justify-center p-6 font-parag">
      

      <div className="w-full max-w-[420px] animate-fade-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-3xl mb-2">✦</div>
          <h1 className="font-heading text-4xl text-darkb tracking-[-1px] mb-2">
            Welcome back
          </h1>
          <p className="text-[16px] text-secondary-text italic">
            Your gratitudes are waiting for you.
          </p>
        </div>

        {/* Card */}
        <div className="bg-fwhite border border-borderline rounded-3xl py-9 px-8">
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
              className="w-full box-border bg-fwhite border border-borderline rounded-xl py-3.5 px-5 font-parag text-[14px] text-darkb"/>
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
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full box-border bg-fwhite border border-borderline rounded-xl py-3.5 px-5 font-parag text-[14px] text-darkb"/>
          </div>

          {/* Error */}
          {error && (
            <div  className="bg-secondary-bg border border-borderline rounded-xl py-2.5 px-3.5 mb-5 text-[13px] text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full p-3.5 rounded-2xl font-heading text-[16px] italic font-bold "
            style={{
              background: loading || !email || !password
                ? "rgba(196,98,45,0.2)"
                : "linear-gradient(135deg, #C4622D, #E07B3A)",
              color: loading || !email || !password ? "rgba(196,98,45,0.5)" : "#FFF8F0",
              cursor: loading || !email || !password ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[14px] text-secondary-text mt-6" >
          Don't have an account?{" "}
          <Link to="/signup" className="text-secondary font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}