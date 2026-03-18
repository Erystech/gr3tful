import React from "react";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-darkb py-20 md:py-28 px-6 md:px-10">
      <div className="m-auto text-center"
       style={{ maxWidth: 700}}>
        <div className="text-4xl mb-5">✦</div>
        <h2 className="font-heading text-fwhite mb-5"
          style={{
            fontSize: "clamp(32px, 5vw, 60px)",
            letterSpacing: "-2px",
            lineHeight: 1.1,
          }}
        >
          What are you grateful
          <br />
          <span className="text-gold italic">for today?</span>
        </h2>

        <p className="font-parag text-gray-t mb-9"
          style={{
            fontSize: "clamp(14px, 2vw, 16px)",
            lineHeight: 1.7,
          }}
        >
          It takes 90 seconds. It costs nothing. And it might just change the way you see everything.
        </p>

        <Link
          to="/signup"  
          className="bg-gold 
            font-heading 
            italic
            text-primary-text-dark
            py-4 
            px-10
            cursor-pointer
            w-full
            sm:w-auto"
          style={{
            borderRadius: 100,
            fontWeight: 700,
            fontSize: "clamp(15px, 2vw, 17px)",
            boxShadow: "0 8px 40px rgba(245,166,35,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          
        >
          Begin your practice — it's free →
        </Link>

        <p className="font-parag text-#6B4A35 mt-3.5"
        style={{ fontSize: 13}}>
          Make gratitude part of your everyday life. sign up now
        </p>
      </div>
    </section>
  );
}

export default CTASection;