import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function useGratitudeCount() {
  const [gratitudeCount, setGratitudeCount] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchGratitudeCount() {
      const { data, error } = await supabase
        .from("public_stats")
        .select("gratitude_count")
        .eq("id", "global")
        .single();

      if (!cancelled && !error) {
        setGratitudeCount(Number(data.gratitude_count));
      }
    }

    fetchGratitudeCount();
    return () => { cancelled = true; };
  }, []);

  return gratitudeCount;
}
