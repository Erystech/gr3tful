import { useState, useMemo, useEffect } from "react";
import { TAGS, TAG_EMOJIS, RAW_ENTRIES } from "../data/JournalData";
import { formatDate,  formatShort, getMonth }  from "../utils/NewDateUtil";
import useWindowWidth from "../hooks/useWindowWidth";
import EntryCard from "../Journal/EntryCard";
import StatsBar from "../Journal/StatsBar";
import Sidebar from "../Journal/SideBar";











// ── Main Page ─────────────────────────────────────────────────────────────
export default function JournalPage() {
  const [search, setSearch]           = useState("");
  const [activeTag, setActiveTag]     = useState(null);
  const [expandedId, setExpandedId]   = useState(null);
  const [calDate, setCalDate]         = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const width = useWindowWidth();
  const isMobile = width < 768;
  const showInlineSidebar = width >= 1024;

  const topTag = useMemo(() => {
    const freq = {};
    RAW_ENTRIES.forEach(e => e.tags.forEach(t => { freq[t] = (freq[t]||0)+1; }));
    return Object.entries(freq).sort((a,b) => b[1]-a[1])[0]?.[0] ?? "—";
  }, []);

  const filtered = useMemo(() => {
    return RAW_ENTRIES.filter(e => {
      if (calDate && e.date !== calDate) return false;
      if (activeTag && !e.tags.includes(activeTag)) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.entries.some(t => t.toLowerCase().includes(q)) ||
               e.tags.some(t => t.toLowerCase().includes(q)) ||
               formatDate(e.date).toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, activeTag, calDate]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(e => {
      const m = getMonth(e.date);
      if (!map[m]) map[m] = [];
      map[m].push(e);
    });
    return map;
  }, [filtered]);

  return (
    <div style={{ minHeight:"100vh", background:"#FEF3E2" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color:rgba(155,106,69,0.5); font-style:italic; }
        input:focus { outline:none; }
        .tag-scroll::-webkit-scrollbar { display:none; }
        .tag-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(196,98,45,0.2); border-radius:10px; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{
        position:"sticky", top:0, zIndex:40,
        background:"rgba(254,243,226,0.92)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(196,98,45,0.1)",
        padding: isMobile ? "12px 16px" : "14px 28px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>✦</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:18, color:"#3D2314" }}>gratefuly</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap: isMobile ? 10 : 20 }}>
          {!isMobile && ["Today","Journal","Settings"].map(n => (
            <a key={n} href="#" style={{ fontFamily:"'Lora',serif", fontSize:13, color: n==="Journal" ? "#C4622D" : "#9B6A45", textDecoration:"none", fontWeight: n==="Journal" ? 600 : 400 }}>{n}</a>
          ))}
          {/* Tools button on mobile/tablet */}
          {!showInlineSidebar && (
            <button onClick={() => setSidebarOpen(true)} style={{
              background:"rgba(196,98,45,0.08)", border:"1px solid rgba(196,98,45,0.15)",
              borderRadius:10, padding:"7px 12px",
              fontFamily:"'Lora',serif", fontSize:12, color:"#C4622D",
              cursor:"pointer", display:"flex", alignItems:"center", gap:5,
            }}>
              📅 Tools
            </button>
          )}
        </div>
      </div>

      {/* ── Slide-over drawer (mobile + tablet) ── */}
      {!showInlineSidebar && (
        <>
          {sidebarOpen && (
            <div onClick={() => setSidebarOpen(false)} style={{
              position:"fixed", inset:0, zIndex:49,
              background:"rgba(61,35,20,0.4)", backdropFilter:"blur(2px)",
            }} />
          )}
          <div style={{
            position:"fixed", top:0, right:0, bottom:0, zIndex:50,
            width: isMobile ? "88vw" : 360,
            background:"#FEF3E2",
            boxShadow:"-8px 0 32px rgba(61,35,20,0.12)",
            overflowY:"auto", padding:"24px 20px",
            transform: sidebarOpen ? "translateX(0)" : "translateX(110%)",
            transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#3D2314", fontWeight:700 }}>Tools</span>
              <button onClick={() => setSidebarOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#9B6A45" }}>✕</button>
            </div>
            <Sidebar
              calDate={calDate}
              setCalDate={d => { setCalDate(d); setSidebarOpen(false); }}
              setSearch={setSearch}
            />
          </div>
        </>
      )}

      {/* ── Page body ── */}
      <div style={{
        maxWidth:1100, margin:"0 auto",
        padding: isMobile ? "28px 16px 80px" : "40px 24px 80px",
        display:"grid",
        gridTemplateColumns: showInlineSidebar ? "1fr 300px" : "1fr",
        gap:28, alignItems:"start",
      }}>

        {/* ── Main column ── */}
        <div style={{ animation:"fadeUp 0.5s ease forwards", minWidth:0 }}>

          {/* Title */}
          <div style={{ marginBottom:24 }}>
            <p style={{ fontFamily:"'Lora',serif", fontSize:12, color:"#C4622D", textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>Your journal</p>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,5vw,44px)", color:"#3D2314", letterSpacing:"-1.5px", lineHeight:1.1 }}>
              A record of your<br/>
              <span style={{ fontStyle:"italic", color:"#C4622D" }}>good things.</span>
            </h1>
          </div>

          {/* Stats */}
          <StatsBar total={RAW_ENTRIES.length} streak={7} topTag={topTag} isMobile={isMobile} />

          {/* Search */}
          <div style={{ position:"relative", marginBottom:14 }}>
            <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:14, opacity:0.4 }}>🔍</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setCalDate(null); }}
              placeholder="Search your entries…"
              style={{
                width:"100%", boxSizing:"border-box",
                background:"#FFF8F0", border:"1px solid rgba(196,98,45,0.15)",
                borderRadius:14, padding:"12px 40px 12px 42px",
                fontFamily:"'Lora',serif", fontSize:14, color:"#3D2314",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:15, color:"#C4A882" }}>✕</button>
            )}
          </div>

          {/* Tag pills — horizontally scrollable, no scrollbar visible */}
          <div className="tag-scroll" style={{ overflowX:"auto", paddingBottom:4, marginBottom:24, WebkitOverflowScrolling:"touch" }}>
            <div style={{ display:"flex", gap:7, width:"max-content" }}>
              <button onClick={() => setActiveTag(null)} style={{
                background: !activeTag ? "#C4622D" : "rgba(196,98,45,0.07)",
                border: !activeTag ? "none" : "1px solid rgba(196,98,45,0.15)",
                borderRadius:100, padding:"7px 16px",
                fontFamily:"'Lora',serif", fontSize:12,
                color: !activeTag ? "#FFF8F0" : "#7A4A2A",
                cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap",
              }}>All</button>
              {TAGS.map(tag => {
                const on = activeTag === tag;
                return (
                  <button key={tag} onClick={() => setActiveTag(on ? null : tag)} style={{
                    background: on ? "#C4622D" : "rgba(196,98,45,0.07)",
                    border: on ? "none" : "1px solid rgba(196,98,45,0.15)",
                    borderRadius:100, padding:"7px 14px",
                    fontFamily:"'Lora',serif", fontSize:12,
                    color: on ? "#FFF8F0" : "#7A4A2A",
                    cursor:"pointer", transition:"all 0.2s",
                    display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap",
                  }}>
                    <span>{TAG_EMOJIS[tag]}</span>{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active date chip */}
          {calDate && (
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontFamily:"'Lora',serif", fontSize:13, color:"#C4622D" }}>📅 Showing: {formatShort(calDate)}</span>
              <button onClick={() => setCalDate(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#C4A882", fontSize:14 }}>✕</button>
            </div>
          )}

          {/* Entry groups */}
          {Object.keys(grouped).length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <p style={{ fontSize:36, marginBottom:12 }}>🌿</p>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#3D2314", marginBottom:8 }}>Nothing found</p>
              <p style={{ fontFamily:"'Lora',serif", fontSize:14, color:"#9B6A45" }}>Try a different search or filter.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([month, monthEntries]) => (
              <div key={month} style={{ marginBottom:32 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:12, color:"#9B6A45", fontWeight:700, textTransform:"uppercase", letterSpacing:1, whiteSpace:"nowrap" }}>{month}</span>
                  <div style={{ flex:1, height:1, background:"rgba(196,98,45,0.1)" }} />
                  <span style={{ fontFamily:"'Lora',serif", fontSize:12, color:"#C4A882", whiteSpace:"nowrap" }}>{monthEntries.length} {monthEntries.length===1?"entry":"entries"}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {monthEntries.map(entry => (
                    <EntryCard key={entry.date} entry={entry}
                      isExpanded={expandedId === entry.date}
                      onToggle={() => setExpandedId(expandedId === entry.date ? null : entry.date)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Inline sidebar (desktop ≥1024px only) ── */}
        {showInlineSidebar && (
          <div style={{ animation:"fadeUp 0.5s ease 0.15s forwards", opacity:0 }}>
            <Sidebar calDate={calDate} setCalDate={setCalDate} setSearch={setSearch} />
          </div>
        )}
      </div>
    </div>
  );
}