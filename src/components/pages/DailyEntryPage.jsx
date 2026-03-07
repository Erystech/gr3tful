import { useState, useEffect } from "react";
import PROMPTS from "../utils/prompts";
import ProgressRing from "../ProgressRing";
import GratitudeInput from "../GratitudeInput";
import SuccessState from "../SuccessState";

const MOOD_TAGS = [
  { label: "Family", emoji: "👨‍👩‍👧" },
  { label: "Health", emoji: "🌿" },
  { label: "Work", emoji: "💼" },
  { label: "Nature", emoji: "🌤️" },
  { label: "Friends", emoji: "🤝" },
  { label: "Growth", emoji: "🌱" },
  { label: "Joy", emoji: "✨" },
  { label: "Rest", emoji: "🌙" },
];

function getRandomPrompt(exclude = "") {
  const options = PROMPTS.filter((p) => p !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

function getToday() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DailyEntryPage() {
  const [entries, setEntries] = useState(["", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [placeholders, setPlaceholders] = useState([0, 1, 2].map(() => getRandomPrompt()));
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [streak] = useState(7);

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

  const handleSubmit = () => {
    if (!allFilled) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%   { opacity: 0; transform: rotate(var(--r)) translateX(40px) scale(0); }
          60%  { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--r)) translateX(80px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        textarea::placeholder { color: rgba(155,106,69,0.55); }
        textarea:focus { outline: none; }
      `}</style>

      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-40 bg-[rgba(255,248,235,0.9)] backdrop-blur-[12px] border-b border-[rgba(196,98,45,0.1)] p-[14px_24px] flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-[18px]">✦</span>
          <span className="font-['Playfair_Display',serif] font-bold text-[18px] text-[#3D2314]">
            Gr3tful
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Streak badge */}
          <div
            className="flex items-center gap-[6px] bg-[rgba(196,98,45,0.08)] rounded-[100px] p-[6px_14px]"
          >
            <span className="text-[14px]">🔥</span>
            <span className="font-['Lora',serif] text-[13px] text-[#C4622D]">
              <strong>{streak}</strong> day streak
            </span>
          </div>

          {/* Avatar placeholder */}
          <div
            className="w-[34px] h-[34px] rounded-[50%] bg-[linear-gradient(135deg,#C4622D,#F5A623)] flex items-center justify-center"
          >
            <span className="text-[14px]">🌸</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="max-w-[680px] mx-auto p-[40px_20px_80px]"
      >
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
              className="flex items-start justify-between mb-[36px] opacity-0 [animation:fadeSlideUp_0.5s_ease_forwards]"
            >
              <div>
                <p className="font-['Lora',serif] text-[13px] text-[#C4622D] uppercase tracking-[2px] mb-[6px]">
                  Today's entry
                </p>
                <h1
                  className="font-['Playfair_Display',serif] text-[clamp(22px,4vw,32px)] text-[#3D2314] tracking-[-1px] leading-[1.2]"
                >
                  {getToday()}
                </h1>
              </div>
              <ProgressRing count={filledCount} />
            </div>

            {/* Intro line */}
            <div
              className="opacity-0 [animation:fadeSlideUp_0.5s_ease_forwards_0.1s] mb-[28px]"
            >
              <p
                className="font-['Lora',serif] text-[15px] text-[#9B6A45] leading-[1.7] italic border-l-[2px_solid_rgba(196,98,45,0.3)] pl-[16px]"
              >
                Take a breath. What three things — big or tiny — are you grateful for today?
              </p>
            </div>

            {/* Gratitude inputs */}
            <div className="flex flex-col gap-[16px] mb-[32px]">
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
                      className="absolute bottom-[14px] right-[14px] bg-none border-none cursor-pointer font-['Lora',serif] text-[11px] text-[rgba(155,106,69,0.5)] flex items-center gap-[4px] p-0"
                    >
                      ↻ new prompt
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Mood tags */}
            <div
              className="opacity-0 [animation:fadeSlideUp_0.5s_ease_forwards_0.45s] mb-[36px]"
            >
              <p
                className="font-['Lora',serif] text-[12px] text-[#9B6A45] uppercase tracking-[1.5px] mb-[12px]"
              >
                Tag today's theme <span className="opacity-50">(optional)</span>
              </p>
              <div className="flex flex-wrap gap-[8px]">
                {MOOD_TAGS.map((tag) => {
                  const active = selectedTags.find((t) => t.label === tag.label);
                  return (
                    <button
                      key={tag.label}
                      onClick={() => handleTagToggle(tag)}
                      className={`bg-${active ? '[#C4622D]' : '[rgba(196,98,45,0.07)]'} border-${active ? '[#C4622D]' : '[rgba(196,98,45,0.15)]'} rounded-[100px] p-[8px_16px] font-['Lora',serif] text-[13px] text-${active ? '[#FFF8F0]' : '[#7A4A2A]'} cursor-pointer transition-all duration-200 ease flex items-center gap-[6px]`}
                    >
                      <span>{tag.emoji}</span>
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div
              className="opacity-0 [animation:fadeSlideUp_0.5s_ease_forwards_0.55s]"
            >
              <button
                onClick={handleSubmit}
                disabled={!allFilled}
                className={`w-full p-[18px_24px] ${allFilled ? 'bg-[linear-gradient(135deg,#C4622D,#E07B3A)] shadow-[0_8px_32px_rgba(196,98,45,0.25)]' : 'bg-[rgba(196,98,45,0.12)]'} border-none rounded-[18px] font-['Playfair_Display',serif] text-[17px] italic font-bold ${allFilled ? 'text-[#FFF8F0] cursor-pointer' : 'text-[rgba(196,98,45,0.4)] cursor-not-allowed'} transition-all duration-300`}
                onMouseEnter={(e) => {
                  if (allFilled) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(196,98,45,0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = allFilled ? "0 8px 32px rgba(196,98,45,0.25)" : "none";
                }}
              >
                {allFilled ? "Save today's gratitudes →" : `${3 - filledCount} more to go…`}
              </button>

              {/* Motivational nudge */}
              {!allFilled && filledCount > 0 && (
                <p
                  className="text-center font-['Lora',serif] text-[13px] text-[#C4622D] italic mt-[12px]"
                >
                  You're doing great — just {3 - filledCount} more ✦
                </p>
              )}
            </div>

            {/* Bottom quote */}
            <div
              className="mt-[48px] text-center opacity-0 [animation:fadeSlideUp_0.5s_ease_forwards_0.65s]"
            >
              <p
                className="font-['Lora',serif] text-[13px] text-[rgba(155,106,69,0.55)] italic"
              >
                "Gratitude turns what we have into enough."
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}