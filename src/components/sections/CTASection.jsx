import React from "react";

function CTASection() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-10" style={{ background: "#3D2314" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 18 }}>✦</div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 5vw, 60px)",
            color: "#FFF8F0",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: 18,
          }}
        >
          What are you grateful
          <br />
          <span style={{ color: "#F5A623", fontStyle: "italic" }}>for today?</span>
        </h2>

        <p
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "clamp(14px, 2vw, 16px)",
            color: "#C4A882",
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          It takes 90 seconds. It costs nothing. And it might just change the way you see everything.
        </p>

        <button
          className="w-full sm:w-auto"
          style={{
            background: "#F5A623",
            color: "#3D2314",
            border: "none",
            borderRadius: 100,
            padding: "16px 40px",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "clamp(15px, 2vw, 17px)",
            cursor: "pointer",
            fontStyle: "italic",
            boxShadow: "0 8px 40px rgba(245,166,35,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 50px rgba(245,166,35,0.45)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 40px rgba(245,166,35,0.3)";
          }}
        >
          Begin your practice — it's free →
        </button>

        <p style={{ fontFamily: "'Lora', serif", fontSize: 13, color: "#6B4A35", marginTop: 14 }}>
          No account required to start. No credit card. Ever.
        </p>
      </div>
    </section>
  );
}

export default CTASection;