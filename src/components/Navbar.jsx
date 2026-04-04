import React, { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

function NavBar({
  showLinks = true,
  showStreak = false,
  streak = 0,
  rightContent = null,
  mobileMenu = null,  
  links = null,
  showCTA = false, 

}) {
  const defaultLinks = [
    {label: "Home", to:"/"},
    { label: "Features", to: "/features" },
    { label: "About",    to: "#" },
  ];
  const navLinks = links ?? defaultLinks;
  


  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-fwhite flex items-center justify-between px-6 md:px-10 py-4 md:py-5 backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">✦</span>
          <span className="font-heading font-bold text-[20px] text-darkb tracking-tight">
            gr3tful
          </span>
        </div>

        {/* Desktop Links */}
        {showLinks && (
          <div className="hidden md:flex items-center gap-8">

            {navLinks.map((item) => (
              <Link
                key={item.label}
                to= {item.to}
                className={clsx(
                  "font-parag text-[14px] text-secondary-text no-underline",
                  item.active ? "text-secondary font-semibold" : "text-secondary-text font-normal"
                )}
              >
                {item.label}
              </Link>
          ))}
          {showCTA && (
              <Link
                to="/signup"
                className="bg-secondary text-fwhite rounded-full py-2.5 px-6 font-parag text-[14px] cursor-pointer italic"
              >
                Begin today →
              </Link>
            )}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-4">
          {showStreak && (
            <div className="font-parag">
              🔥 <strong>{streak}</strong> 
            </div>
          )}
          {rightContent}
          {mobileMenu?.trigger}  
        </div>
      </nav>
      {mobileMenu?.dropdown}
    </>
  );
}

export default NavBar;