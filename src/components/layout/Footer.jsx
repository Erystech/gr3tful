import React from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../BrandLogo";

function Footer() {
  return (
    <footer
      className="bg-deep border-t-borderline py-8 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
      
    >
      {/* Logo */}
      <Link to="/welcome" aria-label="Gr3tful home" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <BrandLogo inverse className="w-36" />
      </Link>

      <p
        className="font-parag text-footer-text text-center text-[13px] order-last md:order-0"
      >
        © 2026 Gr3tful · All rights reserved
      </p>

      {/* Links */}
      <div className="flex gap-5 md:gap-6">
        {[
          { label: "Privacy", to: "/privacy" },
          { label: "Terms", to: "/terms" },
          { label: "Contact", to: "/contact" },
        ].map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="font-parag text-footer-text text-[13px]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
