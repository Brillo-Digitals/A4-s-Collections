import { useEffect } from "react";
import { usePageOverlay } from "./PageOverlayContext";

// ── Page content definitions ──────────────────────────────────────────────────
const PAGES = {
  about: {
    label: "About Us",
    hero: "We dress real people\nfor real moments.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80",
    sections: [
      {
        heading: "Who We Are",
        body: "A4's Collection was founded by Saidat Adesiyan, an English student at the Federal University of Education, Adeyemi. What began as a campus passion project has grown into a small online brand focused on creating pieces that are stylish, comfortable, and confidently worn.",
      },
      {
        heading: "What We Stand For",
        body: "We believe fashion should feel personal and effortless. Every piece in our collection is thoughtfully chosen to balance comfort, quality, and trend — versatile outfits for campus life, casual days, or stepping out in style.",
      },
      {
        heading: "Our Promise",
        body: "Every garment is handled with care from start to finish. We prioritize quality, honesty, and customer satisfaction, working with suppliers who share our commitment to ethical practices and craftsmanship.",
      },
    ],
  },

  story: {
    label: "Our Story",
    hero: "It started with one\ncoat and a vision.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    sections: [
      {
        heading: "2026 — The Beginning",
        body: "A4's Collection was started by Saidat Adesiyan, a student from Modakeke, Osun State, with a small online collection and a big dream: to create clothing that feels intentional and wearable. The first few pieces quickly found their way to early supporters.",
      },
      {
        heading: "2027 — Finding Our Footing",
        body: "The brand began gaining attention on campus and online. Saidat expanded the collection thoughtfully, experimenting with styles and fabrics, all while balancing student life and her passion for fashion.",
      },
      {
        heading: "2028 — Growing Up",
        body: "A4's Collection is slowly carving a place in the online fashion scene, reaching customers across Nigeria. While the team is still small, every piece reflects the care, creativity, and authenticity that started it all.",
      },
      {
        heading: "Tomorrow",
        body: "The journey is just beginning. Saidat aims to build a brand that continues to grow responsibly, creating pieces that customers love, feel good in, and remember — all while staying true to the brand’s student-led roots.",
      },
    ],
  },

  sustainability: {
    label: "Sustainability",
    hero: "Fashion with a\nconscience.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=80",
    sections: [
      {
        heading: "Ethical Sourcing",
        body: "Every fabric we use is traced back to its origin. We work exclusively with mills and suppliers who can demonstrate fair wages, safe conditions, and transparent supply chains. No shortcuts.",
      },
      {
        heading: "Low-Waste Production",
        body: "We produce in small, considered batches rather than flooding the market with excess. Off-cuts are donated to local tailoring schools. Packaging is recycled or reusable. We are actively reducing our footprint season by season.",
      },
      {
        heading: "Longevity Over Trend",
        body: "The most sustainable garment is the one you wear for ten years. We design deliberately outside of the trend cycle — creating pieces built to be loved, repaired, and passed on rather than discarded.",
      },
      {
        heading: "Our Goals",
        body: "By 2028, we aim for 80% of our materials to be certified sustainable. By 203-, we are committed to carbon-neutral shipping across all our delivery routes. This is not a marketing position — it is a binding commitment.",
      },
    ],
  },
  faq: {
    label: "FAQ",
    hero: "Commonly Asked\nQuestions",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?w=1200&q=80",
    sections: [
      {
        heading: "Campus Delivery",
        body: "We deliver directly across campus for your convenience. Orders usually arrive within 1-2 days, so you can get your new pieces quickly without leaving your dorm or lecture hall.",
      },
      {
        heading: "Returns & Exchanges",
        body: "Changed your mind? No worries! You can return or exchange items within 7 days of delivery as long as they’re in original condition with tags still attached.",
      },
      {
        heading: "Order Updates",
        body: "After your order is placed, we’ll keep you updated via WhatsApp or email so you know exactly when your delivery will arrive.",
      },
    ],
  },
  contact: {
    label: "Contact Us",
    hero: "We'd Love to\nHear from You",
    image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1200&q=80",
    sections: [
      {
        heading: "Get in Touch",
        body: "Have questions about orders, styles, or collaborations? Send us a message and we’ll get back to you within 24 hours.\n\nEmail: adesiyansaidat2@gmail.com\nWhatsApp: +234 814 729 4918",
      },
      {
        heading: "Campus Pick-Up",
        body: "Prefer to collect your order in person? We offer pick-up across campus by appointment. Just reach out to schedule a convenient time.",
      },
    ],
  },
  shipping: {
    label: "Shipping & Returns",
    hero: "Careful Handling,\nSwift Delivery",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?w=1200&q=80",
    sections: [
      {
        heading: "Campus Delivery",
        body: "Flat Rate: ₦500 across campus.\nFree delivery for orders above ₦30,000.\nOrders usually arrive within 1-2 days.",
      },
      {
        heading: "Outside Campus",
        body: "For friends and family off-campus, contact us directly to arrange delivery. Rates and timing depend on location.",
      },
    ],
  },
  sizing: {
    label: "Size Guide",
    hero: "Find Your\nPerfect Fit",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200&q=80",
    sections: [
      {
        heading: "Women's Sizing",
        body: "Our pieces are designed with a tailored yet comfortable fit. If you're between sizes, we generally recommend sizing up for a more relaxed look.\n\nS: UK 6-8\nM: UK 10-12\nL: UK 14-16",
      },
      {
        heading: "Men's Sizing",
        body: "Our men's collection follows standard European sizing. Measurements reflect the garment's dimensions.",
      },
    ],
  },
  tos: {
    label: "Terms of Service",
    hero: "Friendly, Fair, and Clear",
    image: "https://images.unsplash.com/photo-1581092795361-2c9b3e0c0c2b?w=1200&q=80",
    sections: [
      {
        heading: "Using Our Service",
        body: "By placing an order with A4's Collection, you agree to provide accurate information and follow our campus delivery guidelines. We aim to make shopping simple, safe, and enjoyable.",
      },
      {
        heading: "Order & Payment",
        body: "Orders are confirmed once payment is received. Payments can be made via the methods listed at checkout. Prices may change, but we always notify you before finalizing your order.",
      },
      {
        heading: "Responsibility",
        body: "We strive to deliver your items in perfect condition, but we are not liable for delays outside our control. Please inspect your order on arrival and contact us immediately for any issues.",
      },
    ],
  },

  privacy: {
    label: "Privacy Policy",
    hero: "Your Privacy Matters",
    image: "https://images.unsplash.com/photo-1603575448361-2f1e1f58ecf1?w=1200&q=80",
    sections: [
      {
        heading: "Information We Collect",
        body: "We collect only the information necessary to process orders, communicate with you, and improve our service — like name, email, phone number, and delivery details.",
      },
      {
        heading: "How We Use Your Information",
        body: "Your information is used to fulfill orders, provide customer support, and send updates about new collections or promotions. We never sell your data to third parties.",
      },
      {
        heading: "Security & Storage",
        body: "We store your information securely and take reasonable measures to protect it. You can request to view or delete your data at any time by contacting us.",
      },
    ],
  },
};

// ── Overlay Component ─────────────────────────────────────────────────────────
export default function PageOverlay() {
  const { activePage, closePage } = usePageOverlay();
  const isOpen = Boolean(activePage);
  const page = PAGES[activePage];

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closePage(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePage]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closePage}
        style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Panel — slides up from bottom */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={page?.label}
        style={{
          position: "fixed", inset: 0, zIndex: 10001,
          overflowY: "auto",
          background: "#f7f5f2",
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {page && <PageContent page={page} onClose={closePage} />}
      </div>
    </>
  );
}

// ── Page Content Layout ───────────────────────────────────────────────────────
function PageContent({ page, onClose }) {
  return (
    <div>
      {/* Close button — fixed top right */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed", top: 24, right: 24, zIndex: 10002,
          width: 44, height: 44, borderRadius: "50%",
          background: "#011c40", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          transition: "transform 0.2s, background 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#1a3a6b"}
        onMouseLeave={e => e.currentTarget.style.background = "#011c40"}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 2l12 12M14 2L2 14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Hero image */}
      <div style={{ position: "relative", height: "55vh", minHeight: 320, overflow: "hidden" }}>
        <img
          src={page.image}
          alt={page.label}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            display: "block",
          }}
        />
        {/* Dark gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(1,28,64,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
        }} />

        {/* Hero text */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "40px 32px 36px",
          maxWidth: 800,
        }}>
          <p style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.3em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
            margin: "0 0 12px",
          }}>
            A4's Collection
          </p>
          <h1 style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            fontWeight: 300, color: "#fff",
            lineHeight: 1.1, margin: 0,
            whiteSpace: "pre-line",
          }}>
            {page.hero}
          </h1>
        </div>
      </div>

      {/* Body content */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 32px 100px" }}>

        {/* Page label */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <span style={{ display: "block", width: 32, height: 1.5, background: "#011c40" }} />
          <p style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.28em",
            textTransform: "uppercase", color: "#011c40", margin: 0,
          }}>
            {page.label}
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {page.sections.map((section, i) => (
            <div
              key={i}
              style={{
                paddingBottom: 48,
                borderBottom: i < page.sections.length - 1 ? "1px solid #e2ddd8" : "none",
              }}
            >
              <h2 style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 300, color: "#011c40",
                lineHeight: 1.2, margin: "0 0 16px",
              }}>
                {section.heading}
              </h2>
              <p style={{
                fontSize: 15, lineHeight: 1.9,
                color: "#78716c", margin: 0,
                fontWeight: 400,
                whiteSpace: "pre-line",
              }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={onClose}
          style={{
            marginTop: 24,
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#011c40", color: "#fff", border: "none",
            padding: "14px 32px", cursor: "pointer",
            fontSize: 10, fontWeight: 800, letterSpacing: "0.18em",
            textTransform: "uppercase", transition: "background 0.3s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#1a3a6b"}
          onMouseLeave={e => e.currentTarget.style.background = "#011c40"}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11 6.5H2M5 3L2 6.5 5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Shop
        </button>
      </div>
    </div>
  );
}