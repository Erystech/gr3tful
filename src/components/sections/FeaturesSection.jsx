import React from "react";

const features = [
  { icon: "🔥", title: "Streak Tracking", desc: "Stay motivated with daily streaks that celebrate your consistency." },
  { icon: "📅", title: "Calendar View", desc: "A visual overview of every day you've shown up for yourself." },
  { icon: "💌", title: "Look Back Feature", desc: "Resurface a random past entry — a little gift from your past self." },
  { icon: "🏷️", title: "Mood Tags", desc: "Tag entries by theme: family, health, work, nature, and more." },
  { icon: "🌙", title: "Dark Mode", desc: "Beautiful for evening reflection under soft, warm lighting." },
  { icon: "📄", title: "Export Journal", desc: "Download your entries as a PDF or CSV — your story, forever yours." },
];

function FeaturesSection() {
  return (
    <section className="bg-secondary-bg py-20 md:py-28 px-6 md:px-10" >
      <div className="m-auto" style={{ maxWidth: 1100 }}>

        {/* Heading */}
        <div className="text-center mb-12 md:mb-20">
          <h2
            className="text-primary-text-dark font-heading "
            style={{
              fontSize: "clamp(28px, 4vw, 54px)",
              letterSpacing: "-1.5px",
              lineHeight: 1.2,
            }}
          >
            Everything you need.
            <br />
            <span className="italic text-secondary">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-fwhite rounded-2xl border border-borderline cursor-default p-6 md:p-7"
              style={{
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(196,98,45,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3
                className="font-heading text-primary-text-dark mb-2"
                style={{
                  fontSize: "clamp(16px, 2vw, 18px)",
                }}
              >
                {f.title}
              </h3>
              <p
                className="font-parag text-secondary-text"
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;