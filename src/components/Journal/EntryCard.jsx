import React, { useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { formatDate } from "../utils/NewDateUtil";
import { TAG_EMOJIS } from "../data/JournalData";

function EntryCard({ entry, isExpanded, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftEntries, setDraftEntries] = useState(entry.entries);
  const [saving, setSaving] = useState(false);

   // Check if within 24 hours of created_at
    const isEditable = entry.created_at &&
    (Date.now() - new Date(entry.created_at).getTime()) < 24 * 60 * 60 * 1000;

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(entry.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setDraftEntries([...entry.entries]); // reset draft to current saved values
    setIsEditing(true);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setDraftEntries([...entry.entries]);
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (draftEntries.some((d) => !d.trim())) return; 
    setSaving(true);
    const success = await onEdit(entry.id, draftEntries);
    setSaving(false);
    if (success) {
      toast.success("Entry Updated!")
    } setIsEditing(false);
  };

  return (
    <div
      onClick={isEditing ? undefined : onToggle} // disable toggle while editing
      className={clsx(
        "bg-fwhite border border-borderline rounded-3xl overflow-hidden transition-all duration-200",
        !isEditing && !isExpanded &&
          "cursor-pointer hover:shadow-[0_4px_20px_rgba(196,98,45,0.1)] hover:-translate-y-[1px]",
        isExpanded && "shadow-[0_8px_32px_rgba(196,98,45,0.15)]",
        isEditing && "cursor-default"
      )}
    >
      {/* Header */}
      <div className="py-4 px-5 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={clsx(
              "w-9 h-9 rounded-xl shrink-0 flex items-center justify-center transition-colors duration-200",
              isExpanded ? "bg-secondary" : "bg-borderline-light"
            )}
          >
            <span className="text-sm">✦</span>
          </div>

          <div className="min-w-0">
            <p className="font-heading text-fontSize font-bold mb-1 truncate">
              {formatDate(entry.date)}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className="font-parag text-xs text-secondary bg-borderline-light rounded-full py-0.5 px-2 whitespace-nowrap"
                >
                  {TAG_EMOJIS[t]} {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isExpanded && !isEditing && isEditable && (
            <button
              onClick={handleEditClick}
              title="Edit this entry"
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors duration-150 border border-secondary/20"
            >
              <span className="text-[13px]">✏️</span>
            </button>
          )}

          {isExpanded && !isEditing &&  (
            <button
              onClick={handleDelete}
              title="Delete this entry"
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-100 transition-colors duration-150 border border-red-200"
            >
              <span className="text-[14px]">🗑️</span>
            </button>
          )}

          {!isEditing && (
            <span
              className={clsx(
                "font-parag text-xl text-gray-t transition-transform duration-300",
                isExpanded ? "rotate-180" : "rotate-0"
              )}
            >
              ⌄
            </span>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 border-t border-borderline-light">
          {isEditing ? (
            // ── Edit mode ──────────────────────────────────────────
            <div className="pt-2 flex flex-col gap-3">
              {draftEntries.map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-gold flex items-center justify-center shrink-0 mt-1">
                    <span className="text-fwhite text-xs font-bold">{i + 1}</span>
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => {
                      const next = [...draftEntries];
                      next[i] = e.target.value.slice(0, 200);
                      setDraftEntries(next);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    rows={2}
                    className="flex-1 bg-secondary-bg border border-borderline rounded-xl px-3.5 py-2.5 font-parag text-[14px] text-darkb leading-relaxed resize-none outline-none focus:border-secondary transition-colors"
                    placeholder={`Gratitude ${i + 1}…`}
                  />
                </div>
              ))}

              {/* Save / Cancel */}
              <div className="flex gap-2 mt-1 justify-end">
                <button
                  onClick={handleCancel}
                  className="font-parag text-[13px] text-secondary-text border border-borderline rounded-xl py-2 px-4 cursor-pointer hover:bg-borderline-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || draftEntries.some((d) => !d.trim())}
                  className="font-parag text-[13px] text-fwhite bg-secondary rounded-xl py-2 px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          ) : (
            // ── Read mode ──────────────────────────────────────────
            <div className="pt-3.5 flex flex-col gap-3">
              {entry.entries.map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-gold flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-fwhite text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="font-parag text-darkb leading-relaxed italic">
                    "{text}"
                  </p>
                </div>
              ))}

              {/* Subtle hint if edit window has passed */}
              {!isEditable && (
                <p className="font-parag text-[11px] text-gray-t italic mt-1 text-right">
                  Editing closed after 24 hours
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EntryCard;