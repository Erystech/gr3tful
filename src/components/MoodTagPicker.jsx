import clsx from "clsx";
import { MOOD_TAGS } from "./data/JournalData";

const MoodTagPicker = ({ selected, onToggle }) => {
    return (
        <div className="opacity-0 animate-fade-slide-up-text mb-9">
            <p className="font-parag text-[12px] text-secondary-text uppercase tracking-[1.5px] mb-3">
                Tag today's theme <span className="opacity-50">(optional)</span>
            </p>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map((tag) => {
                  const active = selected.find((t) => t.label === tag.label);
                    return (           
                        <button
                          key={tag.label}
                          onClick={() => onToggle(tag)}
                          className={clsx(
                            "rounded-full py-2 px-4  font-parag text-[13px] cursor-pointer flex items-center gap-1.5 transition-all duration-200 ease-in",
                            active 
                                ?"bg-darkb border-borderline text-secondary-text"
                                :"bg-secondary border border-secondary text-fwhite"
                              )}
                            >
                          <span>{tag.emoji}</span>
                              {tag.label}
                        </button>
                    );
                })}
             </div>
         </div>
    )
};

export default MoodTagPicker;