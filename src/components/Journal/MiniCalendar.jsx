import React from "react";
import { useState } from "react";

// ── Mini Calendar ─────────────────────────────────────────────────────────
const arrowBtn = {
  background:"none", border:"none", cursor:"pointer",
  fontFamily:"'Playfair Display',serif", fontSize:18, color:"#9B6A45",
  padding:"2px 8px", borderRadius:6,
};

function MiniCalendar({ entries=[], selectedDate, onSelect }) {
  const [viewDate, setViewDate] = useState(new Date());
  const entryDates = new Set(entries.map(e => e.date));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );
  const monthLabel = viewDate.toLocaleDateString("en-US", { month:"long", year:"numeric" });
  const pad = n => `${year}-${String(month+1).padStart(2,"0")}-${String(n).padStart(2,"0")}`;

  return (
    <div style={{ background:"#FFF8F0", borderRadius:20, padding:20, border:"1px solid rgba(196,98,45,0.12)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <button onClick={() => setViewDate(new Date(year, month-1, 1))} style={arrowBtn}>‹</button>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:"#3D2314", fontWeight:700 }}>{monthLabel}</span>
        <button onClick={() => setViewDate(new Date(year, month+1, 1))} style={arrowBtn}>›</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:6 }}>
        {["S","M","T","W","T","F","S"].map((d,i) => (
          <div key={i} style={{ textAlign:"center", fontFamily:"'Lora',serif", fontSize:10, color:"#C4A882", padding:"2px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = pad(day);
          const hasEntry = entryDates.has(dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === new Date().toISOString().split("T")[0];
          return (
            <button key={i} onClick={() => hasEntry && onSelect(isSelected ? null : dateStr)} style={{
              width:"100%", aspectRatio:"1", borderRadius:8,
              border: isToday ? "1.5px solid #C4622D" : "none",
              background: isSelected ? "#C4622D" : hasEntry ? "rgba(196,98,45,0.1)" : "transparent",
              fontFamily:"'Lora',serif", fontSize:12,
              color: isSelected ? "#FFF8F0" : hasEntry ? "#C4622D" : "#C4A882",
              cursor: hasEntry ? "pointer" : "default",
              fontWeight: hasEntry ? 600 : 400,
              transition:"all 0.2s", position:"relative",
            }}>
              {day}
              {hasEntry && !isSelected && (
                <span style={{ position:"absolute", bottom:2, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:"50%", background:"#C4622D", display:"block" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export {MiniCalendar, arrowBtn}
