import React from "react";
import { MiniCalendar } from "./MiniCalendar";
import { RAW_ENTRIES } from "../data/JournalData";
// ── Sidebar content ───────────────────────────────────────────────────────
function Sidebar({ calDate, setCalDate, setSearch }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <p style={{ fontFamily:"'Lora',serif", fontSize:11, color:"#C4622D", textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>Browse by date</p>
        <MiniCalendar entries={RAW_ENTRIES} selectedDate={calDate} onSelect={d => { setCalDate(d); setSearch(""); }} />
      </div>
      <div style={{ background:"#3D2314", borderRadius:20, padding:22, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(245,166,35,0.08)" }} />
        <span style={{ fontSize:22, display:"block", marginBottom:10 }}>💌</span>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#FFF8F0", marginBottom:6, letterSpacing:"-0.3px" }}>One year ago…</p>
        <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:"#C4A882", lineHeight:1.6, fontStyle:"italic", marginBottom:16 }}>"The way the sunset turned everything gold"</p>
        <button style={{ background:"rgba(245,166,35,0.15)", border:"1px solid rgba(245,166,35,0.25)", borderRadius:100, padding:"8px 16px", fontFamily:"'Lora',serif", fontSize:12, color:"#F5A623", cursor:"pointer" }}>
          See more ↗
        </button>
      </div>
      <div style={{ background:"#FFF8F0", border:"1px solid rgba(196,98,45,0.12)", borderRadius:20, padding:20 }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:"#3D2314", marginBottom:6 }}>Export your journal</p>
        <p style={{ fontFamily:"'Lora',serif", fontSize:13, color:"#9B6A45", lineHeight:1.6, marginBottom:16 }}>Download all your entries as a PDF or CSV file.</p>
        <div style={{ display:"flex", gap:8 }}>
          {["PDF","CSV"].map(fmt => (
            <button key={fmt} style={{ flex:1, background:"rgba(196,98,45,0.07)", border:"1px solid rgba(196,98,45,0.15)", borderRadius:10, padding:10, fontFamily:"'Lora',serif", fontSize:13, color:"#7A4A2A", cursor:"pointer", transition:"all 0.2s" }}
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
