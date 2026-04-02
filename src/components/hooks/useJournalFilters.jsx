import { useState, useMemo } from "react";
import { RAW_ENTRIES } from "../data/JournalData";
import {formatDate, getMonth } from "../utils/NewDateUtil";

const useJournalFilters = () => {
    const [calDate, setCalDate]         = useState(null);
    const [activeTag, setActiveTag]     = useState(null);
    const [search, setSearch]           = useState("");


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

      return {
        search, setSearch,
        activeTag, setActiveTag,
        calDate, setCalDate,
        filtered,
        grouped,
      }
}


export default useJournalFilters;
