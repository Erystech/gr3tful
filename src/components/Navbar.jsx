import React, { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 md:py-5"
        style={{ background: "rgba(255,248,235,0.85)", backdropFilter: "blur(12px)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 22 }}>✦</span>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#3D2314",
              letterSpacing: "-0.5px",
            }}
          >
            gr3tful
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "Features", "About"].map((item) => (
            <Link
              to="/entry"  
              key={item}
              href="#"
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 14,
                color: "#7A4A2A",
                textDecoration: "none",
              }}
            >
              {item}
            </Link>
          ))}
          <button
            style={{
              background: "#C4622D",
              color: "#FFF8F0",
              border: "none",
              borderRadius: 100,
              padding: "9px 22px",
              fontFamily: "'Lora', serif",
              fontSize: 14,
              cursor: "pointer",
              fontStyle: "italic",
            }}
          >
            Begin today →
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span style={{ display: "block", width: 22, height: 2, background: "#3D2314", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none" }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#3D2314", borderRadius: 2, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#3D2314", borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex flex-col pt-20 pb-8 px-6 gap-6 md:hidden"
        style={{
          background: "rgba(255,248,235,0.97)",
          backdropFilter: "blur(12px)",
          transform: menuOpen ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.35s ease",
          boxShadow: "0 8px 32px rgba(61,35,20,0.08)",
        }}
      >
        {["Features", "Journal", "About"].map((item) => (
          <a
            key={item}
            href="#"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 18,
              color: "#7A4A2A",
              textDecoration: "none",
              borderBottom: "1px solid rgba(196,98,45,0.12)",
              paddingBottom: 16,
            }}
          >
            {item}
          </a>
        ))}
        <button
          style={{
            background: "#C4622D",
            color: "#FFF8F0",
            border: "none",
            borderRadius: 100,
            padding: "14px 22px",
            fontFamily: "'Lora', serif",
            fontSize: 16,
            cursor: "pointer",
            fontStyle: "italic",
          }}
        >
          Begin today →
        </button>
      </div>
    </>
  );
}

export default NavBar;