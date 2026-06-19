import { useState, useRef, useEffect, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import {getRandomPrompt} from "../utils/Prompts";
import { useStreak } from "../hooks/useStreak.jsx";
import ProgressRing from "../ProgressRing";
import GratitudeInput from "../GratitudeInput";
import SuccessState from "../SuccessState";
import SubmitButton from "../SubmitButton"
import MoodTagPicker from "../MoodTagPicker";
import {
  getJournalDayWindow,
  getCurrentJournalDate,
  isInGracePeriod,
  getPreviousJournalDate, // TEMP: catch-up feature
} from "../utils/dayWindow.js";
import { formatDate } from "../utils/NewDateUtil";
import { supabase } from "../../supabaseClient.js"

// ── TEMP FEATURE FLAG ───────────────────────────────────────────────────
// Lets users back-fill yesterday's entry if they missed it due to the
// recent bug. Flip to `false` (or delete every block tagged "CATCH-UP")
// once everyone's had a chance to catch up.
const ENABLE_YESTERDAY_CATCHUP = true;

export default function DailyEntryPage() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState(["", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [placeholders, setPlaceholders] = useState([0, 1, 2].map(() => getRandomPrompt()));
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CATCH-UP: state for the optional "fill in yesterday" mode
  const [catchUpMode, setCatchUpMode] = useState(false);
  const [yesterdayMissing, setYesterdayMissing] = useState(false);

  const today = getCurrentJournalDate();
  const yesterday = useMemo(() => getPreviousJournalDate(today), [today]);
  const activeDate = catchUpMode ? yesterday : today;
  const inGracePeriod = isInGracePeriod();

  const streak = useStreak();

  const filledCount = entries.filter((e) => e.trim().length > 0).length;
  const allFilled = filledCount === 3;

  // CATCH-UP: only offer this if there's actually a gap to fill
  useEffect(() => {
    if (!ENABLE_YESTERDAY_CATCHUP) return;
    let cancelled = false;

    async function checkYesterday() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { start, end } = getJournalDayWindow(new Date(`${yesterday}T12:00:00`));
      const { data } = await supabase
        .from("entries")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", start)
        .lte("created_at", end)
        .maybeSingle();
      if (!cancelled) setYesterdayMissing(!data);
    }
    checkYesterday();
    return () => { cancelled = true; };
  }, [yesterday]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.find((t) => t.label === tag.label)
        ? prev.filter((t) => t.label !== tag.label)
        : [...prev, tag]
    );
  };

  const handleRefreshPrompt = (index) => {
    setPlaceholders((prev) => {
      const next = [...prev];
      next[index] = getRandomPrompt(next[index]);
      return next;
    });
  };
  const timerRef = useRef(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
  if (!allFilled || isSubmitting) return;   // ← blocks double taps immediately
  setIsSubmitting(true);

  try {
    const { data: { user } } = await supabase.auth.getUser();

    const windowReference = catchUpMode
      ? new Date(`${yesterday}T12:00:00`)
      : new Date();

    const { start, end } = getJournalDayWindow(windowReference);
    const { data: existing } = await supabase
      .from("entries")
      .select("id")
      .eq("user_id", user.id)
      .gte("created_at", start)
      .lte("created_at", end)
      .maybeSingle();

    if (existing) {
      toast.error(
        catchUpMode
          ? "Looks like yesterday's already filled in."
          : "You've already journaled today. Come back tomorrow!"
      );
      return;
    }

    const insertPayload = {
      user_id: user.id,
      item_1: entries[0],
      item_2: entries[1],
      item_3: entries[2],
      tags: selectedTags.map((t) => t.label),
    };

    if (catchUpMode) {
      insertPayload.created_at = windowReference.toISOString();
    }

    const { error } = await supabase.from("entries").insert(insertPayload);

    if (error) {
      toast.error("Couldn't save. Please try again");
      return;
    }

    setSubmitted(true);
    toast.success(catchUpMode ? "Got it — yesterday's entry is saved!" : "Gratitudes saved! ");

    timerRef.current = setTimeout(() => {
      navigate("/journal");
    }, 2000);
  } finally {
    setIsSubmitting(false);   // ← always re-enables, even on error/early return
  }
};

  return (
    <>
    <div className="min-h-screen bg-fwhite">
      <Toaster position="top-center" />
      <Navbar 
        showLinks={false}
        showStreak
        streak={streak}
      />

      <div className="max-w-170 mx-auto mt-10 pt-10 px-5 pb-20">
        {submitted ? (
          <SuccessState
            entries={entries}
            selectedTags={selectedTags}
            onReset={() => setSubmitted(false)}
          />
        ) : (
          <>
            {/* CATCH-UP: banner offering to fill in yesterday */}
            {ENABLE_YESTERDAY_CATCHUP && yesterdayMissing && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-secondary/10 border border-borderline rounded-2xl py-3 px-4 opacity-0 animate-fade-slide-up">
                <p className="font-parag text-[13px] text-secondary-text">
                  {catchUpMode
                    ? `Filling in your missed entry for ${formatDate(yesterday)}.`
                    : "Missed yesterday because of a hiccup on our end? You can still add it."}
                </p>
                <button
                  onClick={() => setCatchUpMode((v) => !v)}
                  className="shrink-0 font-parag text-[13px] text-secondary underline cursor-pointer bg-transparent border-none"
                >
                  {catchUpMode ? "Back to today" : "Add yesterday's entry"}
                </button>
              </div>
            )}

            {/* Date + Progress header */}
            <div
              className="flex items-start justify-between mb-9 opacity-0 animate-fade-slide-up"
            >
              <div>
                <p className="font-parag text-[13px] text-secondary uppercase tracking-[2px] mb-1.5">
                  {catchUpMode ? "Catching up" : "Today's entry"}
                </p>
                <h1
                  className="font-heading text-[clamp(22px,4vw,32px)]  text-darkb tracking-[-1px] leading-[1.2]"
                >
                 {formatDate(activeDate)}
                </h1>
                {!catchUpMode && inGracePeriod && (
                  <p className="font-parag text-[11px] text-secondary italic mt-1">
                    Before 9am, this still counts as yesterday.
                  </p>
                )}
              </div>
              <ProgressRing count={filledCount} />
            </div>

            {/* Intro line */}
            <div className="opacity-0 animate-fade-slide-up-text mb-7">
              <p
                className="font-parag text-[15px] text-secondary-text leading-4 italic border-l-2 border-l-borderline pl-4"
              >
                Take a breath. What three things — big or tiny — are you grateful for {catchUpMode ? "that day" : "today"}?
              </p>
            </div>

            {/* Gratitude inputs */}
            <div className="flex flex-col gap-4 mb-8">
              {entries.map((entry, i) => (
                <div key={i} className="relative">
                  <GratitudeInput
                    index={i}
                    value={entry}
                    onChange={(val) => {
                      const next = [...entries];
                      next[i] = val;
                      setEntries(next);
                    }}
                    placeholder={placeholders[i]}
                    isFocused={focusedIndex === i}
                    onFocus={() => setFocusedIndex(i)}
                    onBlur={() => setFocusedIndex(null)}
                  />
                  {!entry && (
                    <button
                      onClick={() => handleRefreshPrompt(i)}
                      title="New prompt"
                      className="absolute bottom-3.5 right-3.5 bg-none border-none cursor-pointer font-parag text-[11px] text-gray-t flex items-center gap-1 p-0"
                    >
                      ↻ new prompt
                    </button>
                  )}
                </div>
              ))}
            </div>

            <MoodTagPicker 
              selected={selectedTags} 
              onToggle={handleTagToggle} />

            <SubmitButton 
              allFilled={allFilled} 
              filledCount={filledCount} 
              isSubmitting={isSubmitting}
              onSubmit={() => allFilled && !isSubmitting && handleSubmit()}/>  

            <div className="mt-12 text-center opacity-0 animate-fade-slide-up-text">
              <p className="font-parag text-[13px] text-secondary-text italic">
                "Gratitude turns what we have into enough."
              </p>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}