import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import { calcStreak } from "../utils/streakUtil";
import { useAuth } from "../context/AuthContext";

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
        setEntries(data.map((row) => ({ date: row.created_at.split("T")[0] })));
      }
    }
    fetchDates();
  }, [user]);

  return useMemo(() => calcStreak(entries), [entries]);
}
