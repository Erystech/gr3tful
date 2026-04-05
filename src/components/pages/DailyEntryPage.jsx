import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import {getRandomPrompt} from "../utils/Prompts";
import ProgressRing from "../ProgressRing";
import GratitudeInput from "../GratitudeInput";
import SuccessState from "../SuccessState";
import SubmitButton from "../SubmitButton"
import MoodTagPicker from "../MoodTagPicker";
import { formatDate } from "../utils/NewDateUtil";
import { supabase } from "../../Supabaseclient";



export default function DailyEntryPage() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState(["", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [placeholders, setPlaceholders] = useState([0, 1, 2].map(() => getRandomPrompt()));
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [streak] = useState(20);

  const today = new Date().toISOString().split("T")[0];

  const filledCount = entries.filter((e) => e.trim().length > 0).length;
  const allFilled = filledCount === 3;

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

  const handleSubmit = async () => {
  if (!allFilled) return;

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("entries")
    .insert({
      user_id: user.id,
      item_1: entries[0],
      item_2: entries[1],
      item_3: entries[2],
      tags: selectedTags.map((t) => t.label),
    });

  if (error) {
    console.error(error.message);
    return;
  }

  toast.success("Gratitudes saved! ");
  setTimeout(() => navigate("/journal"), 2000);

  setSubmitted(true);
};

  return (
    <>
    <div className="min-h-screen bg-fwhite">
      <Toaster position="top-center" />
      <Navbar 
        showLinks={false}
        showStreak
        streak={streak}
        rightContent={
           <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
            🌸
          </div>
        }
      />
      
      
      
     

      {/* Main content */}
      <div className="max-w-170 mx-auto mt-10 pt-10 px-5 pb-20">
        {submitted ? (
          <SuccessState
            entries={entries}
            selectedTags={selectedTags}
            onReset={() => setSubmitted(false)}
          />
        ) : (
          <>
            {/* Date + Progress header */}
            <div
              className="flex items-start justify-between mb-9 opacity-0 animate-fade-slide-up"
            >
              <div>
                <p className="font-parag text-[13px] text-secondary uppercase tracking-[2px] mb-1.5">
                  Today's entry
                </p>
                <h1
                  className="font-heading text-[clamp(22px,4vw,32px)]  text-darkb tracking-[-1px] leading-[1.2]"
                >
                 {formatDate(today)}
                </h1>
              </div>
              <ProgressRing count={filledCount} />
            </div>

            {/* Intro line */}
            <div className="opacity-0 animate-fade-slide-up-text mb-7">
              <p
                className="font-parag text-[15px] text-secondary-text leading-4 italic border-l-2 border-l-borderline pl-4"
              >
                Take a breath. What three things — big or tiny — are you grateful for today?
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
                  {/* Refresh prompt button */}
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
            {/* MOOD TAGS */}
           <MoodTagPicker 
              selected={selectedTags} 
              onToggle={handleTagToggle} />

            {/* Submit */ }
           <SubmitButton 
              allFilled={allFilled} 
              filledCount={filledCount} 
              onSubmit={() => allFilled && handleSubmit()} />  
            

            {/* Bottom quote */}
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