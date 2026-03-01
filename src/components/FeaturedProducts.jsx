import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./Cart";
import { useProducts } from "./ProductContext";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(true); // Force true by default for debugging/reliability
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

export default function FeaturedProducts() {
  const { addItem, removeItem, items } = useCart();
  const [imgHov, setImgHov] = useState(false);
  const [sectionRef, inView] = useInView(0.08);

  const { products = [], collections = [], loading } = useProducts();

  if (loading || products.length === 0) return null;

  // 3-day rotation logic
  const featured = products.filter(p => p.featured);
  const dayIndex = Math.floor(Date.now() / (3 * 24 * 60 * 60 * 1000));

  // Robust product selection: use featured if available, otherwise fallback to first product
  const product = (featured.length > 0)
    ? featured[dayIndex % featured.length]
    : products[0];

  const inCart = items.some((i) => i.id === product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  function handleCartToggle() {
    if (inCart) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  }

  const fadeUp = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
  });

  return (
    <section
      ref={sectionRef}
      style={{ background: "#0d1520", width: "100%", padding: "80px 0", overflow: "hidden" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* Section label */}
        <div style={{ ...fadeUp(0), marginBottom: 40, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ display: "inline-block", width: 36, height: 1, background: "#c9974c" }} />
          <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.32em", textTransform: "uppercase", color: "#c9974c", margin: 0 }}>
            Editor's Choice
          </p>
        </div>

        {/* Two columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
          gap: "48px 60px",
          alignItems: "start",
        }}>

          {/* ── LEFT: Image ── */}
          <div style={fadeUp(100)}>
            <div
              onMouseEnter={() => setImgHov(true)}
              onMouseLeave={() => setImgHov(false)}
              style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4", background: "#1a2232", cursor: "zoom-in" }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover", objectPosition: "top", display: "block",
                  transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1)",
                  transform: imgHov ? "scale(1.05)" : "scale(1)",
                }}
              />
              {discount && (
                <span style={{
                  position: "absolute", top: 16, right: 16,
                  background: "#c9974c", color: "#0d1520",
                  fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
                  textTransform: "uppercase", padding: "5px 10px",
                }}>
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Title + Price */}
            <div style={fadeUp(180)}>
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                <h2 style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 300, color: "#f0ebe3",
                  lineHeight: 1.1, margin: "0 0 6px", letterSpacing: "-0.01em",
                }}>
                  {product.name}
                </h2>
              </Link>
              <p style={{
                fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#6b7a8d", margin: "0 0 24px", fontWeight: 500,
              }}>
                {collections.find(c => c.id === product.categoryId)?.name}
              </p>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 28 }}>
                <span style={{ fontSize: "1.7rem", fontWeight: 800, color: "#f0ebe3", letterSpacing: "-0.02em" }}>
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span style={{ fontSize: "1rem", color: "#4a5568", textDecoration: "line-through" }}>
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {discount && (
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: "#0d1520",
                    background: "#c9974c", padding: "3px 8px", letterSpacing: "0.1em",
                  }}>
                    SAVE {discount}%
                  </span>
                )}
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 28 }} />
            </div>

            {/* Description */}
            <div style={fadeUp(260)}>
              <p style={{
                fontSize: 13, lineHeight: 1.85, color: "#8899aa",
                fontFamily: "Georgia, serif", fontStyle: "italic", margin: "0 0 28px",
              }}>
                "{product.description}"
              </p>
            </div>

            {/* CTA */}
            <div style={fadeUp(320)}>
              <CartToggleButton inCart={inCart} onClick={handleCartToggle} />
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "28px 0" }} />

            {/* Perks */}
            <div style={{ ...fadeUp(380), display: "flex", flexDirection: "column", gap: 10 }}>
              {Array.isArray(product.perks) && product.perks.map((perk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9974c" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontSize: 11, color: "#6b7a8d", letterSpacing: "0.08em" }}>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Cart Toggle Button ────────────────────────────────────────────────────────
function CartToggleButton({ inCart, onClick }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", overflow: "hidden",
        width: "100%", padding: "16px",
        border: inCart ? "1.5px solid #c0392b" : "none",
        background: inCart
          ? "rgba(192,57,43,0.12)"
          : "#c9974c",
        color: inCart ? "#e74c3c" : "#0d1520",
        fontSize: 11, fontWeight: 900,
        letterSpacing: "0.22em", textTransform: "uppercase",
        cursor: "pointer",
        transition: "background 0.4s ease, color 0.4s ease, border-color 0.4s ease",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}
    >
      {/* Shimmer — only on "add" hover state */}
      {!inCart && (
        <span style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          transform: hov ? "translateX(100%)" : "translateX(-100%)",
          transition: "transform 0.55s ease",
          pointerEvents: "none",
        }} />
      )}

      <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
        {inCart ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
            Remove from Cart
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Add to Cart
          </>
        )}
      </span>
    </button>
  );
}