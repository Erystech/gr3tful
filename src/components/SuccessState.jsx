import React from "react";

function SuccessState({ entries, selectedTags, onReset }) {
  return (
    <div
      className="text-center opacity-0"
      style={{ animation: "fadeSlideUp 0.6s ease forwards" }}
    >
      {/* Celebration */}
      <div className="relative inline-block mb-7">

        <div
          className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#C4622D] to-[#F5A623] 
          flex items-center justify-center mx-auto 
          shadow-[0_12px_40px_rgba(196,98,45,0.3)]"
          style={{
            animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}
        >
          <span className="text-[44px]">✦</span>
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

      <h2 className="text-[clamp(28px,4vw,40px)] text-[#3D2314] tracking-[-1px] mb-[10px] font-serifDisplay">
        Beautiful. You showed up.
      </h2>

      <p className="text-[15px] text-[#9B6A45] leading-[1.7] mb-8 font-journal">
        Today's three things have been saved to your journal.
      </p>

      {/* Entry recap */}
      <div className="bg-[rgba(196,98,45,0.05)] border border-[rgba(196,98,45,0.12)] rounded-[20px] px-7 py-6 text-left mb-7">

        {entries.map((entry, i) => (
          <div
            key={i}
            className={`flex gap-3 items-start ${
              i < 2 ? "pb-4 mb-4 border-b border-[rgba(196,98,45,0.1)]" : ""
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-[#C4622D] flex items-center justify-center flex-shrink-0 mt-[2px]">
              <span className="text-[#FFF8F0] text-[11px]">✓</span>
            </span>

            <p className="text-[14px] text-[#5C3A1E] leading-[1.6] italic font-journal">
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
              className="bg-[rgba(196,98,45,0.1)] rounded-full px-[14px] py-[6px] text-[13px] text-[#C4622D] font-journal"
            >
              {tag.emoji} {tag.label}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={onReset}
        className="bg-transparent border border-[rgba(196,98,45,0.3)] rounded-full px-7 py-3 text-[14px] text-[#7A4A2A] font-journal cursor-pointer"
      >
        ← Back to entry
      </button>
    </div>
  );
}

export default SuccessState;