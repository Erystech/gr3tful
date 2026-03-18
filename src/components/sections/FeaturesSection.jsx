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
    <section className="bg-secondary-bg py-20 md:py-28 px-6 md:px-10">
      <div className="m-auto max-w-[1100px]">

        {/* Heading */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-primary-text-dark font-heading text-[clamp(28px,4vw,54px)] tracking-[-1.5px] leading-[1.2]">
            Everything you need.
            <br />
            <span className="italic text-secondary">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-fwhite rounded-2xl border border-borderline cursor-default p-6 md:p-7
                transition-[transform,box-shadow] duration-200
                hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(196,98,45,0.12)]"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-heading text-primary-text-dark mb-2 text-[clamp(16px,2vw,18px)]">
                {f.title}
              </h3>
              <p className="font-parag text-secondary-text text-[14px] leading-[1.7]">
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