import React from "react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="bg-fwhite relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">

      {/* Background rings — hidden on small screens for perf */}
      <div className="absolute top-1/2 left-1/2 hidden sm:block w-[700px] h-[700px] rounded-full border border-[#C4622D1A] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 hidden sm:block w-[950px] h-[950px] rounded-full border border-[rgba(196,98,45,0.06)] -translate-x-1/2 -translate-y-1/2" />

      {/* Gradient blobs */}
      <div className="absolute top-[20%] right-[5%] w-[min(500px,60vw)] h-[min(500px,60vw)] rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.15)_0%,transparent_70%)]" />
      <div className="absolute bottom-1/6 left-[5%] w-[min(300px,40vw)] h-[min(300px,40vw)] rounded-full bg-[radial-gradient(circle,rgba(196,98,45,0.12)_0%,transparent_70%)]" />

      {/* Main Content */}
      <div className="relative text-center px-6 w-full m-auto max-w-[720px]">

        <div className="inline-block mb-5 px-5 py-2 rounded-full border border-borderline bg-secondary/10">
          <span className="font-parag text-secondary italic text-[13px]">
            A daily ritual for a happier mind
          </span>
        </div>

        <h1 className="font-heading text-primary-text-dark mb-5 text-[clamp(40px,8vw,80px)] leading-[1.1] tracking-[-2px]">
          Three things.
          <br />
          <span className="italic text-secondary">Every day.</span>
        </h1>

        <p className="font-parag text-secondary-text mb-9 text-[clamp(14px,2vw,16px)] leading-[1.7]">
          Build a gratitude practice that shifts how you see the world —
          one small entry at a time.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-block text-center
              bg-secondary text-fwhite
              rounded-[100px]
              py-[14px] px-8
              font-parag text-[16px] italic
              cursor-pointer
              shadow-[0_8px_32px_rgba(196,98,45,0.3)]
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(196,98,45,0.4)]"
          >
            Start your journal →
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-block text-center
              bg-transparent text-secondary-text
              border border-[1.5px] border-secondary-text/30
              rounded-[100px]
              py-[13px] px-7
              font-parag text-[16px]
              cursor-pointer"
          >
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className="font-parag text-secondary-text text-[13px]">
            <strong className="text-darkerb">4,200+</strong> gratitudes written this week
          </span>
        </div>
      </div>

      {/* Scroll indicator — uses animate-float defined in index.css @theme */}
      <div className="hidden sm:flex absolute bottom-8 left-1/2 flex-col items-center gap-1.5 animate-float font-parag text-[11px] text-gray-t tracking-[2px] uppercase">
        <span>scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gray-t to-transparent" />
      </div>

    </section>
  );
}

export default HeroSection;