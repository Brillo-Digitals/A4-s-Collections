import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./Cart";
import { useProducts } from "./ProductContext";

const DESKTOP_INITIAL = 8;
const MOBILE_INITIAL = 4;

function useIsMobile() {
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(true); // Force true by default for reliability
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

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index, visible }) {
  // useCart lives HERE so each card reads the shared cart state directly
  const { addItem, removeItem, items } = useCart();
  const [hovered, setHovered] = useState(false);

  const inCart = items.some((i) => i.id === product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  function handleCartToggle(e) {
    e.stopPropagation(); // don't bubble to card click
    if (inCart) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: "opacity 0.65s ease, transform 0.65s ease",
        transitionDelay: visible ? `${(index % 4) * 90}ms` : "0ms",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>

        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", background: "#e7e5e4", aspectRatio: "3/4" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "top", display: "block",
              transition: "transform 0.7s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />

          {/* Overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(1,28,64,0.45)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
          }} />

          {/* Sale / New badge — top left */}
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: product.badge === "Sale" ? "#fbbf24" : "#011c40",
            color: product.badge === "Sale" ? "#1c1917" : "#fff",
            fontSize: "0.58rem", fontWeight: 700,
            letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "3px 8px",
          }}>
            {discount ? `-${discount}%` : product.badge}
          </span>

          {/* "In Bag" indicator — top right, always visible when in cart */}
          {inCart && (
            <span style={{
              position: "absolute", top: 10, right: 10,
              background: "#22c55e", color: "#fff",
              fontSize: "0.55rem", fontWeight: 800,
              letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "3px 8px",
            }}>
              ✓ In Bag
            </span>
          )}

          {/* Quick Add / Remove — slides up on hover */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            display: "flex", justifyContent: "center", paddingBottom: 16,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.35s ease",
          }}>
            <button
              onClick={handleCartToggle}
              style={{
                background: inCart ? "#fef2f2" : "#fff",
                color: inCart ? "#dc2626" : "#1c1917",
                fontSize: "0.6rem", fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                border: inCart ? "1px solid #fca5a5" : "none",
                padding: "8px 20px",
                cursor: "pointer",
                transition: "background 0.3s",
                display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = inCart ? "#fee2e2" : "#fde68a";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = inCart ? "#fef2f2" : "#fff";
              }}
            >
              {inCart ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                  Remove
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  Quick Add
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ paddingTop: 12 }}>
          <p style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase",
            color: "#78716c", margin: "0 0 6px",
          }}>
            {useProducts().collections.find(c => c.id === product.categoryId)?.name}
          </p>
          <h3 style={{
            fontSize: "0.88rem", fontWeight: 500,
            color: hovered ? "#011c40" : "#292524",
            lineHeight: 1.3, margin: 0, transition: "color 0.3s",
          }}>
            {product.name}
          </h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#011c40" }}>
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: "0.78rem", color: "#a8a29e", textDecoration: "line-through" }}>
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// ── Show More Button ──────────────────────────────────────────────────────────
function ShowMoreButton({ showMore, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", overflow: "hidden",
        border: "1.5px solid #011c40", background: "transparent",
        color: hov ? "#fff" : "#011c40",
        fontSize: "0.7rem", fontWeight: 700,
        letterSpacing: "0.22em", textTransform: "uppercase",
        padding: "14px 40px", cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 10,
        transition: "color 0.35s ease",
      }}
    >
      <span style={{
        position: "absolute", inset: 0, background: "#011c40",
        transform: hov ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
      }} />
      <span style={{ position: "relative", zIndex: 1 }}>{showMore ? "Show Less" : "Show More"}</span>
      <span style={{ position: "relative", zIndex: 1, lineHeight: 0 }}>
        {showMore ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function NewArrivals() {
  const isMobile = useIsMobile();
  const [showMore, setShowMore] = useState(false);
  const [sectionRef, sectionInView] = useInView(0.05);

  const { products = [], loading } = useProducts();

  if (loading) return null;

  const initialCount = isMobile ? MOBILE_INITIAL : DESKTOP_INITIAL;
  const filteredProducts = products.filter(p => p.newArrival);
  const visibleProducts = showMore ? filteredProducts.slice(0, 12) : filteredProducts.slice(0, initialCount);
  const hasMore = filteredProducts.length > initialCount;

  return (
    <section ref={sectionRef} style={{ background: "#f7f5f2", width: "100%", padding: "56px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "flex-end",
          justifyContent: "space-between", marginBottom: 40, gap: 12,
          transition: "opacity 0.7s ease, transform 0.7s ease",
          opacity: sectionInView ? 1 : 0,
          transform: sectionInView ? "translateY(0)" : "translateY(24px)",
        }}>
          <div>
            <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#a8a29e", marginBottom: 8 }}>
              Just Dropped
            </p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 300, color: "#292524", lineHeight: 1.1, margin: 0 }}>
              New Arrivals
            </h2>
          </div>
          <a href="#collections"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#78716c", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            }}>
            View All →
          </a>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: isMobile ? "12px 12px" : "20px 20px",
        }}>
          {visibleProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} visible={sectionInView} />
          ))}
        </div>

        {/* Show More / Less */}
        {hasMore && (
          <div style={{
            display: "flex", justifyContent: "center", marginTop: 48,
            transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
            opacity: sectionInView ? 1 : 0,
            transform: sectionInView ? "translateY(0)" : "translateY(16px)",
          }}>
            <ShowMoreButton showMore={showMore} onClick={() => setShowMore(s => !s)} />
          </div>
        )}
      </div>
    </section>
  );
}