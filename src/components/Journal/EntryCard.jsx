import React from "react";
import { formatDate } from "../utils/NewDateUtil";
import { TAG_EMOJIS } from "../data/JournalData";


// ── Entry Card ────────────────────────────────────────────────────────────
function EntryCard({ entry, isExpanded, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      background:"#FFF8F0", border:"1px solid rgba(196,98,45,0.12)",
      borderRadius:20, overflow:"hidden", cursor:"pointer",
      transition:"box-shadow 0.2s, transform 0.2s",
      boxShadow: isExpanded ? "0 8px 32px rgba(196,98,45,0.12)" : "none",
    }}
      onMouseEnter={e => { if (!isExpanded) { e.currentTarget.style.boxShadow="0 4px 20px rgba(196,98,45,0.1)"; e.currentTarget.style.transform="translateY(-1px)"; }}}
      onMouseLeave={e => { if (!isExpanded) { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}}
    >
      <div style={{ padding:"16px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
          <div style={{
            width:38, height:38, borderRadius:12, flexShrink:0,
            background: isExpanded ? "#C4622D" : "rgba(196,98,45,0.08)",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"background 0.2s",
          }}>
            <span style={{ fontSize:15 }}>✦</span>
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(13px,2vw,15px)", color:"#3D2314", fontWeight:700, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {formatDate(entry.date)}
            </p>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {entry.tags.map(t => (
                <span key={t} style={{ fontFamily:"'Lora',serif", fontSize:11, color:"#C4622D", background:"rgba(196,98,45,0.08)", borderRadius:100, padding:"2px 8px", whiteSpace:"nowrap" }}>
                  {TAG_EMOJIS[t]} {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <span style={{ fontFamily:"'Lora',serif", fontSize:18, color:"#C4A882", flexShrink:0, transition:"transform 0.3s", display:"block", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
      </div>
      {isExpanded && (
        <div style={{ padding:"0 18px 18px", borderTop:"1px solid rgba(196,98,45,0.08)" }}>
          <div style={{ paddingTop:14, display:"flex", flexDirection:"column", gap:12 }}>
            {entry.entries.map((text, i) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#C4622D,#F5A623)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                  <span style={{ color:"#FFF8F0", fontSize:10, fontWeight:700 }}>{i+1}</span>
                </div>
                <p style={{ fontFamily:"'Lora',serif", fontSize:"clamp(13px,1.8vw,15px)", color:"#5C3A1E", lineHeight:1.7, fontStyle:"italic" }}>"{text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EntryCard;