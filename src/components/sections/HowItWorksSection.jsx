import React from "react";

const steps = [
  {
    number: "01",
    title: "Open your journal",
    desc: "Each morning (or whenever feels right), open Gr3tful to your clean, distraction-free entry page.",
  },
  {
    number: "02",
    title: "Write three things",
    desc: "No pressure, no filters. Big things, tiny things — whatever moved you today.",
  },
  {
    number: "03",
    title: "Watch yourself grow",
    desc: "Track your streak, revisit past entries, and notice how your perspective quietly shifts over time.",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-fwhite w-full py-20 md:py-32 px-6 md:px-10">

      {/* Content container */}
      <div className="mx-auto w-full max-w-6xl">

        {/* Heading */}
        <div className="text-center mb-14 md:mb-20">
          <p className="font-parag text-secondary italic uppercase mb-4 text-[13px] tracking-[2px]">
            How it works
          </p>

          <h2 className="font-heading text-darkb text-[clamp(30px,4vw,54px)] tracking-[-1.5px] leading-[1.15]">
            Simple enough to stick with.
            <br />
            <span className="italic text-secondary">
              Meaningful enough to matter.
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-8 overflow-hidden ${
                i === 1
                  ? "bg-darkb"
                  : "bg-secondary/[.06] border border-borderline"
              }`}
            >
              {/* Large background number */}
              <div
                className={`absolute top-4 right-5 font-heading select-none leading-none font-extrabold text-[clamp(56px,8vw,80px)] ${
                  i === 1 ? "text-fwhite/[.06]" : "text-secondary/[.08]"
                }`}
              >
                {step.number}
              </div>

              {/* Title */}
              <h3
                className={`font-heading mb-3 text-[clamp(18px,2.5vw,22px)] tracking-[-0.5px] ${
                  i === 1 ? "text-fwhite" : "text-darkb"
                }`}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className={`font-parag text-[15px] leading-[1.7] ${
                  i === 1 ? "text-gray-t" : "text-secondary-text"
                }`}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorksSection;