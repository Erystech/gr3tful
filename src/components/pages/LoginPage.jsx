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
    <div style={{
      minHeight: "100vh",
      background: "#FFF8F0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Lora', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input:focus { outline: none; }
        input::placeholder { color: rgba(155,106,69,0.5); font-style: italic; }
      `}</style>

      <div style={{
        width: "100%",
        maxWidth: 420,
        animation: "fadeSlideUp 0.5s ease forwards",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✦</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            color: "#3D2314",
            letterSpacing: "-1px",
            marginBottom: 8,
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "#9B6A45", fontStyle: "italic" }}>
            Your gratitudes are waiting for you.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#FEFAF4",
          border: "1px solid rgba(196,98,45,0.15)",
          borderRadius: 24,
          padding: "36px 32px",
        }}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "#9B6A45", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#FFF8F0",
                border: "1px solid rgba(196,98,45,0.2)",
                borderRadius: 12,
                padding: "13px 16px",
                fontFamily: "'Lora', serif",
                fontSize: 14,
                color: "#3D2314",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, color: "#9B6A45", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#FFF8F0",
                border: "1px solid rgba(196,98,45,0.2)",
                borderRadius: 12,
                padding: "13px 16px",
                fontFamily: "'Lora', serif",
                fontSize: 14,
                color: "#3D2314",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(196,98,45,0.08)",
              border: "1px solid rgba(196,98,45,0.2)",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 18,
              fontSize: 13,
              color: "#C4622D",
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            style={{
              width: "100%",
              padding: "15px",
              background: loading || !email || !password
                ? "rgba(196,98,45,0.2)"
                : "linear-gradient(135deg, #C4622D, #E07B3A)",
              border: "none",
              borderRadius: 14,
              fontFamily: "'Playfair Display', serif",
              fontSize: 16,
              fontStyle: "italic",
              fontWeight: 700,
              color: loading || !email || !password ? "rgba(196,98,45,0.5)" : "#FFF8F0",
              cursor: loading || !email || !password ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 14, color: "#9B6A45", marginTop: 24 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#C4622D", textDecoration: "none", fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}