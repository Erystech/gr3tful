import React from "react";

function SuccessState({ entries, selectedTags, onReset }) {
  return (
    <div className="text-center opacity-0 animate-fade-slide-up">

      {/* Celebration */}
      <div className="relative inline-block mb-7">
        <div className="w-25 h-25 rounded-full bg-secondary flex items-center justify-center mx-auto shadow-[0_12px_40px_rgba(196,98,45,0.3)] animate-pop-in">
          <span className="text-5xl">✦</span>
        </div>

        {/* Sparkles */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full top-1/2 left-1/2 opacity-0"
            style={{
              background: i % 2 === 0 ? "#C4622D" : "#F5A623",
              transform: `rotate(${i * 72}deg) translateX(60px)`,
              animation: `sparkle 0.6s ease forwards ${0.3 + i * 0.08}s`,
            }}
          />
        ))}
      </div>

      <h2 className="text-[clamp(28px,4vw,40px)] text-darkb tracking-[-1px] mb-2.5 font-heading">
        Beautiful. You showed up.
      </h2>

      <p className="text-[15px] text-secondary-text leading-[1.7] mb-8 font-parag">
        Today's three things have been saved to your journal.
      </p>

      {/* Entry recap */}
      <div className="bg-secondary/5 border border-borderline rounded-2xl px-7 py-6 text-left mb-7">
        {entries.map((entry, i) => (
          <div
            key={i}
            className={`flex gap-3 items-start ${
              i < 2 ? "pb-4 mb-4 border-b border-secondary/10" : ""
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-fwhite text-[11px]">✓</span>
            </span>

            <p className="text-sm text-darkb/80 leading-[1.6] italic font-parag">
              "{entry}"
            </p>
          </div>
        ))}
      </div>

      {/* Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {selectedTags.map((tag) => (
            <span
              key={tag.label}
              className="bg-secondary/10 rounded-full px-3.5 py-1.5 text-[13px] text-secondary font-parag"
            >
              {tag.emoji} {tag.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default SuccessState;