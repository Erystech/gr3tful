import React from "react";
import  MiniCalendar  from "./MiniCalendar";

// ── Sidebar content ───────────────────────────────────────────────────────
function Sidebar({ entries, calDate, setCalDate, setSearch }) {
  return (
    <div className="flex flex-col gap-5">
      
      {/* Calendar */}
      <div>
        <p className="font-parag text-xs text-secondary uppercase tracking-[2px] mb-2.5">
          Browse by date
        </p>

        <MiniCalendar
          entries={entries}
          selectedDate={calDate}
          onSelect={(d) => {
            setCalDate(d);
            setSearch("");
          }}
        />
      </div>

      {/* Memory Card */}
      <div className="bg-deep rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-5 -right-5 w-full h-full rounded-full bg-borderline-light" />

        <div className="relative flex items-start justify-between gap-3 mb-2.5">
          <span className="text-2xl">💌</span>
          <span className="rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 font-parag text-[9px] uppercase tracking-[1px] text-gold">
            Coming soon
          </span>
        </div>

        <p className="relative font-heading text-xl text-fwhite mb-1.5 tracking-tight">
          Look back
        </p>

        <p className="relative font-parag text-[13px] text-gray-t leading-relaxed italic">
          Rediscover a gratitude from your past when this feature arrives.
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
