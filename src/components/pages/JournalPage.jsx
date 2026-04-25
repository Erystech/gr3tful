import { useState, useMemo, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from  "../context/AuthContext"
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";
import Navbar from "../Navbar";
import { TAGS, TAG_EMOJIS } from "../data/JournalData";
import { formatDate,  formatShort, getMonth }  from "../utils/NewDateUtil";
import { calcStreak } from "../utils/streakUtil";
import useWindowWidth from "../hooks/useWindowWidth";
import EntryCard from "../Journal/EntryCard";
import StatsBar from "../Journal/StatsBar";
import Sidebar from "../Journal/SideBar";
import useJournalFilters from "../hooks/useJournalFilters";

// ── Main Page ─────────────────────────────────────────────────────────────
export default function JournalPage() {
  const {user} = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId]   = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {search, setSearch, activeTag, setActiveTag, calDate, setCalDate, filtered, grouped} = useJournalFilters(entries);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const showInlineSidebar = width >= 1024;

  const topTag = useMemo(() => {
    const freq = {};
    entries.forEach(e => e.tags.forEach(t => { freq[t] = (freq[t]||0)+1; }));
    return Object.entries(freq).sort((a,b) => b[1]-a[1])[0]?.[0] ?? "—";
  }, [entries]);

  const availableTags = useMemo(() =>
  [...new Set(entries.flatMap(e => e.tags))],
  [entries]
);

const streak = useMemo(() => calcStreak(entries), [entries]);

useEffect(() => {
  async function fetchEntries() {
    const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false});

    if(!error) {
      // Transform supabase shape -> component shape
      const transformed = data.map((row) => ({
        date: row.created_at.split("T")[0],
        entries: [row.item_1, row.item_2, row.item_3],
        tags: row.tags ?? [],
      }));
      setEntries(transformed);
    }
    setLoading(false);
  }
  if (user) fetchEntries();
}, [user]);
 

 const journalLinks = [
  { label: "Today",    href: "/entry"   },
  { label: "Journal",  href: "#",        active: true },
  { label: "Settings", href: "#"        },
];
if (loading) 
      return <div className="text-center pt-40 font-parag text-secondary-text">Loading your entries…</div>;

  return (
    <div className="min-h-screen bg-secondary-bg">
      <style>{`
        .tag-scroll::-webkit-scrollbar { display:none; }
        .tag-scroll { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
      <Toaster position="top-center" />
      <Navbar 
        showLinks
        links={journalLinks}
        rightContent={
          !showInlineSidebar && (
            <button 
              onClick={() => setSidebarOpen(true)}
              className="bg-fwhite border border-borderline rounded-[10px] py-1.5 px-3 font-parag text-xs text-secondary cursor-pointer flex items-center gap-1.5"
            >
              📅 Tools
            </button>  
          )
        }/>

        {!loading && entries.length === 0 && (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">✦</p>
            <h2 className="font-heading text-2xl text-darkb mb-2">Your story starts today.</h2>
            <p className="font-parag text-sm text-secondary-text italic mb-6">
              You haven't written any entries yet.
            </p>
            <Link to="/entry" className="bg-secondary text-fwhite rounded-full py-3 px-8 font-parag italic text-sm">
              Write your first entry →
            </Link>
          </div>
        )}
     

      {/* ── Slide-over drawer (mobile + tablet) ── */}
      {!showInlineSidebar && (
        <>
          {sidebarOpen && (
            <div 
              onClick={() => setSidebarOpen(false)} 
              className="fixed bg-darkb/40 backdrop-blur-[2px] inset-0 -z-50 " />
          )}
          <div 
            className= {clsx(
              "fixed top-0 right-0 bottom-0 z-50 bg-secondary-bg py-6 px-5 transition-transform duration-300 ease-in-out overflow-y-auto w-[88vw] md:w-90 ",
              sidebarOpen ? "translate-x-0" : "translate-x-[110%]"
            )}>
            <div
              className="flex justify-between items-center mb-6">
              <span className="font-heading text-[16px] text-darkb font-bold">Tools</span>
              <button onClick={() => setSidebarOpen(false)} 
                className="bg-transparent border-none cursor-pointer text-xl text-darkerb">✕</button>
            </div>
            <Sidebar 
              entries={entries} calDate={calDate} setCalDate={setCalDate} setSearch={setSearch}
            />
          </div>
        </>
      )}

      {/* ── Page body ── */}
      <div 
        className={clsx(
          "max-w-275 mx-auto grid gap-7 items-start ",
          showInlineSidebar ? "grid-cols-[1fr_300px]" : "grid-cols-1",
          isMobile 
            ? "pt-7 px-4 pb-20"
            : "pt-10 px-6 pb-20"

        )}>

        {/* ── Main column ── */}
        <div className="animate-fade-slide-up min-w-0">

          {/* Title */}
          <div className="mb-6">
            <p className="font-parag text-xs text-secondary uppercase tracking-[2px] mb-1.5">Your journal</p>
            <h1 className="font-heading text-[clamp(26px,5vw,44px)] text-darkb tracking-[-1.5px] leading-10">
              A record of your<br/>
              <span className="italic text-secondary">good things.</span>
            </h1>
          </div>

          {/* Stats */}
          <StatsBar total={entries.length} streak={streak} topTag={topTag} isMobile={isMobile} />

          {/* Search */}
          <div className="relative mb-3.5">
            <span className="absolute left-3.5 top-1/2 text-[16px] opacity-[0.4] -translate-y-1/2">🔍</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setCalDate(null); }}
              placeholder="Search your entries…"
              className="w-full box-border bg-fwhite border border-borderline rounded-xl py-3 px-10 font-parag text-[14px] text-darkb"
            />
            {search && (
              <button onClick={() => setSearch("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[14px] text-gray-t">✕</button>
            )}
          </div>

          {/* Mood tags — horizontally scrollable, no scrollbar visible */}
          <div className="tag-scroll overflow-x-auto pb-1 mb-6 ">
            <div className="flex gap-2 w-max">
              <button onClick={() => setActiveTag(null)} 
                className={clsx(
                  "cursor-pointer font-parag text-xs rounded-full py-1.5 px-4 whitespace-nowrap transition-all duration-200",
                  !activeTag ? "bg-secondary border-none text-fwhite" : "bg-borderline-light border-borderline text-secondary-text" 
                )}>All</button>
              {availableTags.map(tag => {
                const on = activeTag === tag;
                return (
                  <button key={tag} onClick={() => setActiveTag(on ? null : tag)}
                    className={clsx(
                      "flex items-center cursor-pointer gap-1.5 font-parag whitespace-nowrap text-xs py-1.5 px-3.5 rounded-full transition-all duration-200",
                      on 
                         ? "bg-secondary border-none text-fwhite" 
                         : "bg-borderline-light border border-borderline text-secondary-text"
                    )}>
                    <span>{TAG_EMOJIS[tag]}</span>{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active date chip */}
          {calDate && (
            <div className="flex items-center gap-2 mb-3.5">
              <span className="font-parag text-xs text-secondary">📅 Showing: {formatShort(calDate)}</span>
              <button onClick={() => setCalDate(null)} 
                className="bg-transparent border-none cursor-pointer text-gray-t text-[14px]">✕</button>
            </div>
          )}

          {/* Entry groups */}
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-15 px-5">
              <p className="text-5xl mb-3">🌿</p>
              <p className="font-heading text-xl text-darkb mb-2">Nothing found</p>
              <p className="font-parag text-[14px] text-secondary"
              style={{  fontSize:14, color:"#9B6A45" }}>Try a different search or filter.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([month, monthEntries]) => (
              <div key={month} className="mb-8">
                <div className="flex items-center gap-2.5 mb-3 ">
                  <span className="font-heading text-xs text-secondary font-bold uppercase tracking-[1] whitespace-nowrap">{month}</span>
                  <div className="flex-1 h-0.5 bg-borderline-light"/>
                  <span className="font-parag text-xs text-gray-t whitespace-nowrap">{monthEntries.length} {monthEntries.length===1?"entry":"entries"}</span>
                </div>
                <div className="flex flex-col gap-2.5">
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
          <div className="animate-fade-slide-up-text ">
            <Sidebar entries={entries} calDate={calDate} setCalDate={setCalDate} setSearch={setSearch} />
          </div>
        )}
      </div>
    </div>
  );
}