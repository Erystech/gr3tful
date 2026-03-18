import React from "react";

const quotes = [
  { text: "I've tried journaling apps before but this one actually got me to stick with it. Just three things. That's all it asks.", name: "Amara K.", days: "142 day streak" },
  { text: "It sounds too simple to work. It isn't. Two months in and I genuinely wake up looking for good things.", name: "Tom R.", days: "61 day streak" },
  { text: "The 'look back' feature made me cry in the best way. I had totally forgotten how hard last year was.", name: "Priya M.", days: "209 day streak" },
];

function TestimonialsSection() {
  return (
    <section className="bg-fwhite py-20 md:py-28 px-6 md:px-10">
      <div className="m-auto max-w-[1100px]">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-heading text-darkb italic text-[clamp(28px,4vw,48px)] tracking-[-1px]">
            Real people. Real shifts.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="bg-secondary-bg border border-borderline rounded-3xl p-6 md:p-8"
            >
              <p className="font-parag text-primary-text-dark italic mb-5 text-[clamp(14px,1.5vw,15px)] leading-[1.8]">
                "{q.text}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-parag text-secondary-text text-[14px] font-semibold">
                  — {q.name}
                </span>
                <span className="font-parag text-gold px-3 py-1 rounded-full whitespace-nowrap bg-secondary/10 text-[12px]">
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