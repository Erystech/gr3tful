import React from "react";

function Footer() {
  return (
    <footer
      className="py-8 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
      style={{ background: "#2A1A0E", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 18 }}>✦</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#C4A882" }}>
          Gr3tful
        </span>
      </div>

      <p
        className="text-center order-last md:order-none"
        style={{ fontFamily: "'Lora', serif", fontSize: 13, color: "#6B4A35" }}
      >
        © 2026 Gr3tful · All rights reserved
      </p>

      {/* Links */}
      <div className="flex gap-5 md:gap-6">
        {["Privacy", "Terms", "Contact"].map((link) => (
          <a
            key={link}
            href="#"
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 13,
              color: "#6B4A35",
              textDecoration: "none",
            }}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;