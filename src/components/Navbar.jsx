import React from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "./context/AuthContext";

function NavBar({
  showLinks = true,
  showStreak = false,
  streak = 0,
  rightContent = null,
  mobileMenu = null,  
  links = null,
  showCTA = false, 
  showThemeToggle = true,

}) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    const { error } = await signOut();
    if (!error) navigate("/");
  }

  const defaultLinks = [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "Journal", to: "/journal" },
  ];
  const navLinks = links ?? defaultLinks;
  


  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/95 flex items-center justify-between px-6 md:px-10 py-4 md:py-5 backdrop-blur-md border-b border-borderline transition-colors duration-300">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">✦</span>
          <span className="font-heading font-bold text-[20px] text-darkb tracking-tight">
            gr3tful
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="flex items-center gap-6">
          {showLinks && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => {
                const className = clsx(
                  "font-parag text-[14px] no-underline",
                  item.active
                    ? "text-secondary font-semibold"
                    : "text-secondary-text font-normal"
                );

                return item.href ? (
                  <a key={item.label} href={item.href} className={className}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} to={item.to} className={className}>
                    {item.label}
                  </Link>
                );
              })}

              {showCTA && !user && (
                <Link
                  to="/login"
                  className="bg-secondary text-fwhite rounded-full py-2.5 px-6 font-parag text-[14px] italic"
                >
                  Login
                </Link>
              )}
            </div>
          )}

          {showStreak && (
            <div className="font-parag text-darkb">
              🔥 <strong>{streak}</strong>
            </div>
          )}

          {showThemeToggle && <ThemeToggle />}

          {user && (
            <button
              type="button"
              onClick={handleSignOut}
              className="hidden md:block font-parag text-[13px] text-secondary-text hover:text-secondary"
            >
              Sign out
            </button>
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
