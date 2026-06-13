import React from "react";

function GratitudeInput({ index, value, onChange, placeholder, isFocused, onFocus, onBlur }) {
  const labels = ["First", "Second", "Third"];
  const filled = value.trim().length > 0;

  const gradient = isFocused
    ? "bg-gradient-to-br from-[#C4622D] to-[#F5A623]"
    : filled
    ? "bg-gradient-to-br from-[rgba(196,98,45,0.4)] to-[rgba(245,166,35,0.4)]"
    : "bg-[rgba(196,98,45,0.12)]";

  return (
    <div
      className="opacity-0"
      style={{
        animation: `fadeSlideUp 0.5s ease forwards`,
        animationDelay: `${index * 0.15}s`,
      }}
    >
      <div
        className={`rounded-[20px] p-px transition-all duration-300 ${gradient} ${
          isFocused ? "shadow-[0_8px_32px_rgba(196,98,45,0.2)]" : ""
        }`}
      >
        <div className="rounded-[19px] bg-fwhite px-6 py-5">

          {/* Label Row */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              
              {/* Circle */}
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  filled || isFocused ? "bg-secondary" : "bg-[rgba(196,98,45,0.1)]"
                }`}
              >
                {filled ? (
                  <span className="text-fwhite text-[13px]">✓</span>
                ) : (
                  <span
                    className={`font-bold text-[12px] ${
                      isFocused ? "text-secondary" : "text-[#9B6A45]"
                    }`}
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {index + 1}
                  </span>
                )}
              </span>

              {/* Label */}
              <span
                className={`uppercase tracking-[1.5px] text-[12px] transition-colors ${
                  isFocused ? "text-secondary" : "text-[#9B6A45]"
                }`}
                style={{ fontFamily: "'Lora', serif" }}
              >
                {labels[index]} gratitude
              </span>
            </div>

            {/* Character count */}
            <span
              className="text-[11px] text-[rgba(155,106,69,0.5)]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {value.length}/500
            </span>
          </div>

          {/* Textarea */}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, 500))}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={3}
            className={`w-full bg-transparent border-none outline-none resize-none text-[16px] leading-[1.7] text-[#3D2314] ${
              value ? "not-italic" : "italic"
            }`}
            style={{ fontFamily: "'Lora', serif" }}
          />
        </div>
      </div>
    </div>
  );
}

export default GratitudeInput;