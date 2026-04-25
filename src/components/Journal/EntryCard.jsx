import React from "react";
import clsx from "clsx";
import { formatDate } from "../utils/NewDateUtil";
import { TAG_EMOJIS } from "../data/JournalData";


// ── Entry Card ────────────────────────────────────────────────────────────
function EntryCard({ entry, isExpanded, onToggle }) {
  return (
    <div onClick={onToggle}
    className={clsx(
      "bg-fwhite border border-borderline rounded-3xl overflow-hidden cursor-pointer transition-gentle ",
      isExpanded ? "shadow-[0_8px_32px boderline)]" : "none"
    )}
      onMouseEnter={e => { if (!isExpanded) { e.currentTarget.style.boxShadow="0 4px 20px rgba(196,98,45,0.1)"; e.currentTarget.style.transform="translateY(-1px)"; }}}
      onMouseLeave={e => { if (!isExpanded) { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}}
    >
      <div className="py-4 px-5 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className={clsx(
            "w-9 h-9 rounded-xl shrink-0 flex items-center justify-center transition-[background] duration-200",
            isExpanded ? "bg-secondary" : "bg-borderline-light"
          )}>
            <span className="text-sm">✦</span>
          </div>
          <div className="min-w-0">
            <p className="font-heading text-fontSize font-bold mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {formatDate(entry.date)}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {entry.tags.map(t => (
                <span key={t} className="font-parag text-xs text-secondary bg-borderline-light rounded-full py-0.5 px-2 whitespace-nowrap">
                  {TAG_EMOJIS[t]} {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className={clsx(
          "font-parag text-xl text-gray-t shrink-0 transition-transform duration-300 block ",
          isExpanded ? "rotate(180deg)" : "rotate(0deg)"
        )}>⌄</span>
      </div>
      {isExpanded && (
        <div className="p-4 border-t border-t-borderline-light" >
          <div className="pt-3.5 flex flex-col gap-3">
            {entry.entries.map((text, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-secondary to-gold flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-fwhite text-xs font-bold">{i+1}</span>
                </div>
                <p className="font-parag text-heading text-darkb leading-0.5 italic ">"{text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EntryCard;