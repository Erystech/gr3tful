import clsx from "clsx";
import React, { useState } from "react";

// ── Mini Calendar ─────────────────────────────────────────────────────────
function MiniCalendar({ entries = [], selectedDate, onSelect }) {
  const [viewDate, setViewDate] = useState(new Date());

  const entryDates = new Set(entries.map(e => e.date));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const pad = (n) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;

  return (
    <div className="bg-fwhite rounded-3xl p-5 border border-borderline">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="font-heading text-[18px] text-secondary px-2 py-1 rounded-md hover:bg-secondary/10 transition"
        >
          ‹
        </button>

        <span className="font-heading text-[14px] text-darkb font-bold">
          {monthLabel}
        </span>

        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="font-heading text-[18px] text-secondary px-2 py-1 rounded-md hover:bg-secondary/10 transition"
        >
          ›
        </button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 mb-1.5">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={i}
            className="text-center font-parag text-xs text-gray-t py-0.5"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const dateStr = pad(day);
          const hasEntry = entryDates.has(dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday =
            dateStr === new Date().toISOString().split("T")[0];

          return (
            <button
              key={i}
              onClick={() =>
                hasEntry && onSelect(isSelected ? null : dateStr)
              }
              className={clsx(
                "w-full aspect-square rounded-lg font-parag text-xs relative transition-all duration-200",

                // states
                isToday && "border border-secondary",
                isSelected
                  ? "bg-secondary text-fwhite"
                  : hasEntry
                  ? "bg-secondary/10 text-secondary"
                  : "text-gray-t",

                hasEntry
                  ? "cursor-pointer font-semibold"
                  : "cursor-default font-normal"
              )}
            >
              {day}

              {hasEntry && !isSelected && (
                <span className="absolute bottom-2 left-1/2 w-1 h-1 rounded-full bg-secondary -translate-x-1/2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MiniCalendar;