import React from "react";
import MiniCalendar from "./MiniCalendar";
import clsx from "clsx";

// ── Stats Bar ─────────────────────────────────────────────────────────────
function StatsBar({ total, streak, topTag, isMobile }) {
  const stats = [
    { label:"Total entries", value:total, icon:"📓" },
    { label:"Current streak", value:`${streak} days`, icon:"🔥" },
    { label:"Top theme", value:topTag, icon:"🏷️" },
  ];
  return (
    <div className={clsx(
      "grid grid-rows-3 mb-6",
      isMobile ? "gap-2" : "gap-3"
    )}>
      {stats.map(s => (
        <div key={s.label} className={clsx(
          "bg-fwhite border border-borderline rounded-2xl",
          isMobile ? "px-2.5 py-2.5" : "px-4 py-5"
        )}>
          <span className={clsx(
            isMobile ? "text-[16px]" :"text-xl"
          )}>{s.icon}</span>
          <p className="font-heading text-darkb font-bold my-1 mx-0.5 -tracking-tighter">{s.value}</p>
          <p className={clsx(
            "font-parag text-footer-text",
            isMobile ? "text-[10px]" : "text-xs"
          )}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;