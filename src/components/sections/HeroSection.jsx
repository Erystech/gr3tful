import React from "react";
import { Link, Links } from "react-router-dom";
import HowItWorksSection from "./HowItWorksSection";

function HeroSection() {
  return (
    <section
      className="bg-fwhite relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Background rings — hidden on small screens for perf */}
      <div
        className="absolute top-1/2 left-1/2  hidden sm:block"
        style={{
          width: 700, height: 700,
          borderRadius: "50%",
          border: "1px solid rgba(196,98,45,0.1)",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 hidden sm:block"
        style={{
          width: 950, height: 950,
          borderRadius: "50%",
          border: "1px solid rgba(196,98,45,0.06)",
          transform: "translate(-50%, -50%)", 
        }}
      />

      {/* Gradient blobs */}
      <div
        className="absolute top-1/5 right-[5%]"
        style={{
          width: "min(500px, 60vw)", height: "min(500px, 60vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/6 left-[5%]"
        style={{
          width: "min(300px, 40vw)", height: "min(300px, 40vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,98,45,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Main Content */}
      <div className="relative text-center px-6 w-full m-auto" style={{ maxWidth: 720 }}>
        <div
          className="inline-block mb-5 px-5 py-2 rounded-full border border-borderline"
          style={{
            background: "rgba(196,98,45,0.1)",
          }}
        >
          <span className="font-parag text-secondary italic"
           style={{ fontSize: 13}}>
            A daily ritual for a happier mind
          </span>
        </div>

        <h1 className="font-heading text-primary-text-dark mb-5"
          style={{
            fontSize: "clamp(40px, 8vw, 80px)",
            lineHeight: 1.1,
            letterSpacing: "-2px",
          }}
        >
          Three things.
          <br />
          <span className="italic text-secondary">Every day.</span>
        </h1>

        <p className="font-parag text-secondary-text mb-9"
          style={{
            fontSize: "clamp(14px, 2vw, 16px)",
            lineHeight: 1.7,
          }}
        >
          Build a gratitude practice that shifts how you see the world —
          one small entry at a time.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
          <Link to="/signup" className="primary-btn w-full sm:w-auto inline-block text-center">
            Start your journal →
          </Link>
          <a href="#how-it-works" className="secondary-btn w-full sm:w-auto">
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className="font-parag text-secondary-text"
          style={{  fontSize: 13}}>
            <strong className="text-darkerb" >4,200+</strong> gratitudes written this week
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator hidden sm:flex">
        <span>scroll</span>
        <div className="line" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lora:wght@400;600&display=swap');

        .primary-btn {
          background: #C4622D;
          color: #FFF8F0;
          border: none;
          border-radius: 100px;
          padding: 14px 32px;
          font-family: 'Lora', serif;
          font-size: 16px;
          font-style: italic;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(196,98,45,0.3);
          transition: all .2s ease;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(196,98,45,0.4);
        }
        .secondary-btn {
          background: transparent;
          color: #7A4A2A;
          border: 1.5px solid rgba(122,74,42,0.3);
          border-radius: 100px;
          padding: 13px 28px;
          font-family: 'Lora', serif;
          font-size: 16px;
          cursor: pointer;
        }
        .scroll-indicator {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          flex-direction: column;
          align-items: center;
          gap: 6px;
          animation: float 2s ease-in-out infinite;
          font-family: 'Lora', serif;
          font-size: 11px;
          color: #C4A882;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, #C4A882, transparent);
        }
        @keyframes float {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -10px); }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;