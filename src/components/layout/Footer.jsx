import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="bg-darkerb border-t-borderline py-8 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
      
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <span className="text-2xl">✦</span>
        <span className="font-heading text-gray-t" 
        style={{fontSize: 16}}>
          gr3tful
        </span>
      </Link>

      <p
        className="font-parag text-footer-text text-center text-[13px] order-last md:order-0"
      >
        © 2026 Gr3tful · All rights reserved
      </p>

      {/* Links */}
      <div className="flex gap-5 md:gap-6">
        {["Privacy", "Terms", "Contact"].map((link) => (
          <a
            key={link}
            href="#"
            className="font-parag text-footer-text text-[13px]"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;