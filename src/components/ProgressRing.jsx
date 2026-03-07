import React from "react";

function ProgressRing({ count, total = 3 }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const filled = (count / total) * circumference;

  return (
    <div className="relative w-[72px] h-[72px]">
      <svg width="72" height="72" className="-rotate-90">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="rgba(196,98,45,0.12)"
          strokeWidth="4"
        />

        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#C4622D"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[18px] font-bold text-[#3D2314] leading-none font-serifDisplay">
          {count}
        </span>

        <span className="text-[10px] text-[#9B6A45] font-journal">
          of {total}
        </span>
      </div>
    </div>
  );
}

export default ProgressRing;