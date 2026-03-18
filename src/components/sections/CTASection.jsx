import React from "react";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-darkb py-20 md:py-28 px-6 md:px-10">
      <div className="m-auto max-w-[700px] text-center">
        <div className="text-4xl mb-5">✦</div>

        <h2 className="font-heading text-fwhite mb-5 text-[clamp(32px,5vw,60px)] tracking-[-2px] leading-[1.1]">
          What are you grateful
          <br />
          <span className="text-gold italic">for today?</span>
        </h2>

        <p className="font-parag text-gray-t mb-9 text-[clamp(14px,2vw,16px)] leading-[1.7]">
          It takes 90 seconds. It costs nothing. And it might just change the way you see everything.
        </p>

        <Link
          to="/signup"
          className="inline-block text-center
            bg-gold
            font-heading
            italic
            font-bold
            text-primary-text-dark
            text-[clamp(15px,2vw,17px)]
            py-4
            px-10
            rounded-[100px]
            cursor-pointer
            w-full
            sm:w-auto
            shadow-[0_8px_40px_rgba(245,166,35,0.3)]
            transition-[transform,box-shadow]
            duration-200
            hover:-translate-y-0.5
            hover:shadow-[0_12px_48px_rgba(245,166,35,0.4)]"
        >
          Begin your practice — it's free →
        </Link>

        <p className="font-parag text-footer-text mt-3.5 text-[13px]">
          Make gratitude part of your everyday life. sign up now
        </p>
      </div>
    </section>
  );
}

export default CTASection;