import React from "react";

// ── Stats Bar ─────────────────────────────────────────────────────────────
function StatsBar({ total, streak, topTag, isMobile }) {
  const stats = [
    { label:"Total entries", value:total, icon:"📓" },
    { label:"Current streak", value:`${streak} days`, icon:"🔥" },
    { label:"Top theme", value:topTag, icon:"🏷️" },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: isMobile ? 8 : 12, marginBottom:24 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background:"#FFF8F0", border:"1px solid rgba(196,98,45,0.12)", borderRadius:16, padding: isMobile ? "10px 10px" : "16px 18px" }}>
          <span style={{ fontSize: isMobile ? 16 : 20 }}>{s.icon}</span>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(14px,3vw,22px)", color:"#3D2314", fontWeight:700, margin:"4px 0 2px", letterSpacing:"-0.5px" }}>{s.value}</p>
          <p style={{ fontFamily:"'Lora',serif", fontSize: isMobile ? 10 : 12, color:"#9B6A45" }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;