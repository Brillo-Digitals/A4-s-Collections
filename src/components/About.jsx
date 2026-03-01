import { useRef, useEffect, useState } from "react";
import { usePageOverlay } from "./PageOverlayContext";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(true); // Force true for reliability
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const stats = [
  { value: "2026", label: "Founded" },
  { value: "2", label: "Small Team" },
  { value: "30+", label: "Happy Customers" },
  { value: "5★", label: "Customer Love" },
];

export default function About() {
  const [sectionRef, inView] = useInView(0.1);
  const { openPage } = usePageOverlay();

  return (
    <section
      ref={sectionRef}
      style={{ background: "#f7f5f2", width: "100%", padding: "72px 0", fontFamily: "system-ui, sans-serif" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* Top label */}
        <p style={{
          fontSize: 9, fontWeight: 800, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "#a8a29e", marginBottom: 0,
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          Who We Are
        </p>

        {/* Two-column layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "48px 64px",
          marginTop: 32,
          alignItems: "center",
        }}>

          {/* Left — image */}
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-32px)",
            transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
          }}>
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"
                alt="Our atelier"
                style={{
                  width: "100%", aspectRatio: "4/5",
                  objectFit: "cover", objectPosition: "center",
                  display: "block",
                }}
              />
              {/* Accent block */}
              <div style={{
                position: "absolute", bottom: -18, right: -18,
                width: 100, height: 100,
                background: "#011c40", zIndex: -1,
              }} />
            </div>
          </div>

          {/* Right — text */}
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(32px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}>
            <h2 style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 300, color: "#1c1917",
              lineHeight: 1.1, margin: "0 0 24px",
            }}>
              Dressed with intention,<br />
              <em style={{ fontStyle: "italic" }}>made with care.</em>
            </h2>

            <p style={{ fontSize: 14, color: "#78716c", lineHeight: 1.85, margin: "0 0 16px", fontWeight: 400 }}>
              A4's Collection was born from a simple belief — that what you wear should feel as good as it looks.
              We design timeless pieces that sit at the intersection of comfort, craft, and quiet elegance.
            </p>
            <p style={{ fontSize: 14, color: "#78716c", lineHeight: 1.85, margin: "0 0 36px", fontWeight: 400 }}>
              Every fabric is chosen with intention. Every stitch is a commitment to quality that lasts beyond
              the season. We're not chasing trends — we're building wardrobes.
            </p>

            <button
              onClick={() => openPage("about")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontSize: 10, fontWeight: 800, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "#011c40",
                background: "none", border: "none", cursor: "pointer",
                borderBottom: "1.5px solid #011c40",
                padding: "0 0 4px", transition: "opacity 0.3s",
                font: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Learn More About Us
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "32px 16px",
          marginTop: 72,
          paddingTop: 48,
          borderTop: "1px solid #e2ddd8",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              textAlign: "center",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s ease ${0.3 + i * 0.1}s, transform 0.6s ease ${0.3 + i * 0.1}s`,
            }}>
              <p style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 300, color: "#011c40",
                margin: "0 0 6px", lineHeight: 1,
              }}>
                {s.value}
              </p>
              <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#a8a29e", margin: 0 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}