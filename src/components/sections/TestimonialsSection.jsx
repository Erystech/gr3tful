import React from "react";

const quotes = [
  { text: "I've tried journaling apps before but this one actually got me to stick with it. Just three things. That's all it asks.", name: "Amara K.", days: "142 day streak" },
  { text: "It sounds too simple to work. It isn't. Two months in and I genuinely wake up looking for good things.", name: "Tom R.", days: "61 day streak" },
  { text: "The 'look back' feature made me cry in the best way. I had totally forgotten how hard last year was.", name: "Priya M.", days: "209 day streak" },
];

function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-10" style={{ background: "#FFF8F0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Heading */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "#3D2314",
              letterSpacing: "-1px",
              fontStyle: "italic",
            }}
          >
            Real people. Real shifts.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 md:p-8"
              style={{
                background: "#FEF3E2",
                border: "1px solid rgba(196,98,45,0.1)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "clamp(14px, 1.5vw, 15px)",
                  color: "#5C3A1E",
                  lineHeight: 1.8,
                  fontStyle: "italic",
                  marginBottom: 20,
                }}
              >
                "{q.text}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span style={{ fontFamily: "'Lora', serif", fontSize: 14, color: "#7A4A2A", fontWeight: 600 }}>
                  — {q.name}
                </span>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(196,98,45,0.1)",
                    fontFamily: "'Lora', serif",
                    fontSize: 12,
                    color: "#C4622D",
                    whiteSpace: "nowrap",
                  }}
                >
                  🔥 {q.days}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;