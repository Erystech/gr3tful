import React from "react";
import { MiniCalendar } from "./MiniCalendar";
// ── Sidebar content ───────────────────────────────────────────────────────
function Sidebar({ entries, calDate, setCalDate, setSearch }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-parag text-xs text-secondary uppercase tracking-[2px] mb-2.5">Browse by date</p>
        <MiniCalendar entries={entries} selectedDate={calDate} onSelect={d => { setCalDate(d); setSearch(""); }} />
      </div>
      <div className="bg-darkb rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-5 -right-5 w-full h-full rounded-full bg-borderline-light"/>
        <span className="text-2xl block mb-2.5">💌</span>
        <p className="font-heading text-xl text-fwhite mb-1.5 -tracking-[-0.3px]">One year ago…</p>
        <p className="font-parag text-[13px] text-gray-t leading-1.5 italic mb-4">"The way the sunset turned everything gold"</p>
        <button className="bg-borderline-light border border-borderline rounded-full py-2 px-4 font-parag text-xs text-gold cursor-pointer">
          See more ↗
        </button>
      </div>
      <div className="bg-fwhite border border-borderline rounded-3xl p-5 ">
        <p className="font-heading text-[15px] text-darkb mb-1.5 ">Export your journal</p>
        <p className="font-parag text-xs text-borderline-light leading-1.5 mb-4">Download all your entries as a PDF or CSV file.</p>
        <div className="flex gap-2">
          {["PDF","CSV"].map(fmt => (
            <button key={fmt} className="flex-1 bg-borderline-light border border-borderline rounded-2xl p-2.5 font-parag text-xs text-secondary-text cursor-pointer transition-all duration-200"
              onMouseEnter={e => { e.currentTarget.style.background="#C4622D"; e.currentTarget.style.color="#FFF8F0"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(196,98,45,0.07)"; e.currentTarget.style.color="#7A4A2A"; }}
            >↓ {fmt}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
