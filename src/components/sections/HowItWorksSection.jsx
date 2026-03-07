import React from "react";

const steps = [
  {
    number: "01",
    title: "Open your journal",
    desc: "Each morning (or whenever feels right), open Gratefuly to your clean, distraction-free entry page.",
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
    <section className="w-full py-20 md:py-32 px-6 md:px-10" style={{ background: "#FFF8F0" }}>
      
      {/* Content container */}
      <div className="mx-auto w-full max-w-6xl">

        {/* Heading */}
        <div className="text-center mb-14 md:mb-20">
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 13,
              color: "#C4622D",
              fontStyle: "italic",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            How it works
          </p>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(30px,4vw,54px)",
              color: "#3D2314",
              letterSpacing: "-1.5px",
              lineHeight: 1.15,
            }}
          >
            Simple enough to stick with.
            <br />
            <span style={{ fontStyle: "italic", color: "#C4622D" }}>
              Meaningful enough to matter.
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative rounded-3xl p-8 overflow-hidden"
              style={{
                background: i === 1 ? "#3D2314" : "rgba(196,98,45,0.06)",
                border: i === 1 ? "none" : "1px solid rgba(196,98,45,0.12)",
              }}
            >
              {/* Large background number */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 22,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(56px,8vw,80px)",
                  fontWeight: 800,
                  color: i === 1
                    ? "rgba(255,248,235,0.06)"
                    : "rgba(196,98,45,0.08)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {step.number}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(18px,2.5vw,22px)",
                  color: i === 1 ? "#FFF8F0" : "#3D2314",
                  marginBottom: 12,
                  letterSpacing: "-0.5px",
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 15,
                  color: i === 1 ? "#C4A882" : "#7A4A2A",
                  lineHeight: 1.7,
                }}
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