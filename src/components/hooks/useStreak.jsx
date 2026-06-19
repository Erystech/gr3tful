import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import { calcStreak } from "../utils/streakUtil";
import { useAuth } from "../context/AuthContext";
import { toJournalDate } from "../utils/dayWindow";

export function useStreak() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!user) return;
    async function fetchDates() {
      const { data, error } = await supabase
        .from("entries")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setEntries(data.map((row) => ({ date: toJournalDate(row.created_at) })));
      }
    }
    fetchDates();
  }, [user]);

  return useMemo(() => calcStreak(entries), [entries]);
}
