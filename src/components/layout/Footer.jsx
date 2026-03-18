import React from "react";

function Footer() {
  return (
    <footer
      className="bg-darkerb border-t-borderline py-8 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
      
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">✦</span>
        <span className="font-heading text-gray-t" 
        style={{fontSize: 16}}>
          gr3tful
        </span>
      </div>

      <p
        className="font-parag text-footer-text text-center order-last md:order-none"
        style={{fontSize: 13}}
      >
        © 2026 Gr3tful · All rights reserved
      </p>

      {/* Links */}
      <div className="flex gap-5 md:gap-6">
        {["Privacy", "Terms", "Contact"].map((link) => (
          <a
            key={link}
            href="#"
            className="font-parag text-footer-text"
            style={{fontSize: 13}}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;