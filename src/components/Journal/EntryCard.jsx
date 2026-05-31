import React from "react";
import clsx from "clsx";
import { formatDate } from "../utils/NewDateUtil";
import { TAG_EMOJIS } from "../data/JournalData";

function EntryCard({ entry, isExpanded, onToggle, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(entry.id);
  };

  return (
    <div
      onClick={onToggle}
      className={clsx(
        "bg-fwhite border border-borderline rounded-3xl overflow-hidden cursor-pointer transition-all duration-200",
        !isExpanded &&
          "hover:shadow-[0_4px_20px_rgba(196,98,45,0.1)] hover:-translate-y-[1px]",
        isExpanded && "shadow-[0_8px_32px_rgba(196,98,45,0.15)]"
      )}
    >
      {/* Header */}
      <div className="py-4 px-5 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={clsx(
              "w-9 h-9 rounded-xl shrink-0 flex items-center justify-center transition-colors duration-200",
              isExpanded ? "bg-secondary" : "bg-borderline-light"
            )}
          >
            <span className="text-sm">✦</span>
          </div>

          <div className="min-w-0">
            <p className="font-heading text-fontSize font-bold mb-1 truncate">
              {formatDate(entry.date)}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className="font-parag text-xs text-secondary bg-borderline-light rounded-full py-0.5 px-2 whitespace-nowrap"
                >
                  {TAG_EMOJIS[t]} {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Delete button */}
          {isExpanded && (
            <button
              onClick={handleDelete}
              title="Delete this entry"
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-100 transition-colors duration-150 border border-red-200"
            >
              <span className="text-[14px]">🗑️</span>
            </button>
          )}
          <span
            className={clsx(
              "font-parag text-xl text-gray-t transition-transform duration-300",
              isExpanded ? "rotate-180" : "rotate-0"
            )}
          >
            ⌄
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 border-t border-borderline-light">
          <div className="pt-3.5 flex flex-col gap-3">
            {entry.entries.map((text, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-gold flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-fwhite text-xs font-bold">{i + 1}</span>
                </div>
                <p className="font-parag text-darkb leading-relaxed italic">
                  "{text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EntryCard;