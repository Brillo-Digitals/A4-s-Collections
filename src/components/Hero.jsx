import { useState, useEffect } from "react";

const banners = [
  {
    id: 1,
    image: "/banner/banner_1.jpeg",
    tag: "New Arrival",
    headline: "Dress for the Moment",
    sub: "Effortless silhouettes crafted for the woman who moves with intention.",
    cta: "Shop Women",
    contentSide: "left",
  },
  {
    id: 2,
    image: "/banner/banner_2.jpeg",
    tag: "Men's Edit",
    headline: "Sharp. Clean. Timeless.",
    sub: "Refined essentials built to outlast every trend and every season.",
    cta: "Shop Men",
    contentSide: "right",
  },
  {
    id: 3,
    image: "/banner/banner_3.jpeg",
    tag: "Office '26",
    headline: "Color. Joy. Freedom.",
    sub: "Bold pieces that carry you from sunrise markets to golden-hour terraces.",
    cta: "Explore Collection",
    contentSide: "right",
  },
];

const INTERVAL = 6000;

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setProgress(0);
    setAnimKey((k) => k + 1);
    const start = Date.now();

    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
    }, 50);

    const timer = setTimeout(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, INTERVAL);

    return () => {
      clearInterval(tick);
      clearTimeout(timer);
    };
  }, [current]);

  const goTo = (i) => setCurrent(i);
  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  return (
    <div id="home" className="relative w-full h-[90vh] min-h-125 overflow-hidden bg-[#011c40]">

      {/* ── Slides ── */}
      {banners.map((banner, i) => {
        const isActive = i === current;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1400 ease-in-out ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
          >
            {/* Background Image */}
            <img
              src={banner.image}
              alt={banner.headline}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-8000 ease-out brightness-50 saturate-[0.85] ${isActive ? "scale-100" : "scale-105"
                }`}
              style={{
                objectPosition: banner.contentSide === "left" ? "right top" : "left top"
              }}
            />

            {/* Directional Gradient Overlay */}
            {banner.contentSide === "left" ? (
              <div className="absolute inset-0 bg-linear-to-r from-[#011c40] via-[#011c40]/30 to-transparent" />
            ) : (
              <div className="absolute inset-0 bg-linear-to-l from-[#011c40] via-[#011c40]/30 to-transparent" />
            )}

            {/* Content Block */}
            <div
              className={`absolute inset-0 flex items-center px-[7%] ${banner.contentSide === "right"
                ? "justify-end text-right"
                : "justify-start text-left"
                }`}
            >
              <div className="max-w-lg space-y-5">

                {/* Tag Badge */}
                <span
                  key={`tag-${animKey}`}
                  style={{ animationDelay: "0.5s", animationFillMode: "both" }}
                  className={`inline-block text-[0.65rem] font-semibold tracking-[0.25em] uppercase px-3 py-1 border text-amber-200 border-amber-200/60 ${isActive ? "animate-[fadeUp_0.7s_ease]" : "opacity-0"
                    }`}
                >
                  {banner.tag}
                </span>

                {/* Headline */}
                <h2
                  key={`h-${animKey}`}
                  style={{ animationDelay: "0.75s", animationFillMode: "both" }}
                  className={`font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-stone-100 tracking-tight ${isActive ? "animate-[fadeUp_0.8s_ease]" : "opacity-0"
                    }`}
                >
                  {banner.headline}
                </h2>

                {/* Sub Text */}
                <p
                  key={`p-${animKey}`}
                  style={{ animationDelay: "1s", animationFillMode: "both" }}
                  className={`text-sm font-light tracking-wide leading-relaxed text-stone-300/80 max-w-sm ${banner.contentSide === "right" ? "ml-auto" : ""
                    } ${isActive ? "animate-[fadeUp_0.7s_ease]" : "opacity-0"}`}
                >
                  {banner.sub}
                </p>

                {/* CTA Button */}
                <button
                  key={`cta-${animKey}`}
                  style={{ animationDelay: "1.2s", animationFillMode: "both" }}
                  className={`group inline-flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-stone-100 hover:text-amber-200 transition-colors duration-300 ${banner.contentSide === "right" ? "flex-row-reverse" : ""
                    } ${isActive ? "animate-[fadeUp_0.6s_ease]" : "opacity-0"}`}
                >
                  <span className="inline-block w-7 h-px bg-stone-100 group-hover:w-12 group-hover:bg-amber-200 transition-all duration-300" />
                  <a href="/#collections">{banner.cta}</a>
                </button>

              </div>
            </div>
          </div>
        );
      })}

      {/* ── Slide Counter (vertical) ── */}
      <div
        className="absolute top-1/2 right-4 -translate-y-1/2 z-10 text-[0.6rem] tracking-[0.2em] text-white/30 select-none"
        style={{ writingMode: "vertical-rl" }}
      >
        {String(current + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}
      </div>

      {/* ── Prev Arrow ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center border border-white/25 text-white hover:bg-white/10 hover:border-white/60 transition-all duration-300"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ── Next Arrow ── */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center border border-white/25 text-white hover:bg-white/10 hover:border-white/60 transition-all duration-300"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ── Dot Indicators ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === current
              ? "w-2 h-2 bg-white scale-125"
              : "w-1.25 h-1.25 bg-white/35 hover:bg-white/60"
              }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/15 z-10">
        <div
          className="h-full bg-amber-200/80 transition-[width] duration-50 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Keyframe definition ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}