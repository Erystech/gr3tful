import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function MobileNavbar(props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Navbar
      {...props}
      mobileMenu={{
        trigger: (
          <button
            className="bg-transparent cursor-pointer flex md:hidden flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-[22px] h-[2px] bg-[#3D2314] transition-all ${menuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
            <span className={`block w-[22px] h-[2px] bg-[#3D2314] transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-[22px] h-[2px] bg-[#3D2314] transition-all ${menuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
          </button>
        ),
        dropdown: (
          <div className={`bg-fwhite backdrop-blur-md shadow fixed top-0 left-0 right-0 z-40 flex flex-col pt-20 pb-8 px-6 gap-6 md:hidden [transition:transform_0.35s_ease] ${menuOpen ? "translate-y-0" : "-translate-y-[110%]"}`}>
             {
                ["Features", "Journal", "About"].map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="font-parag text-[18px] text-secondary-text border-b border-borderline pb-4"
              >
                {item}
              </a>
            ))}
            <Link
              to="/signup"
              className="bg-secondary text-fwhite rounded-full py-3.5 px-6 cursor-pointer italic"
            >
              Begin today →
            </Link>
          </div>
        ),
      }}
    />
  );
}

export default MobileNavbar;