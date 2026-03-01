import { useRef, useEffect, useState } from "react";
import { usePageOverlay } from "./PageOverlayContext";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
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

const links = {
  Shop: ["Women's Wear", "Men's Wear", "Accessories", "Footwear", "Outerwear", "New Arrivals"],
  Company: ["About Us", "Our Story", "Sustainability"],
  Help: ["FAQ", "Shipping & Returns", "Size Guide", "Contact Us"],
};

// Map link text to page names
const linkPageMap = {
  "About Us": "about",
  "Our Story": "story",
  "Sustainability": "sustainability",
  "Contact Us": "contact",
  "Shipping & Returns": "shipping",
  "Size Guide": "sizing",
  "FAQ": "faq",
  "Privacy Policy": "privacy",
  "Terms of Use": "tos"

};

const socials = [
  {
    label: "Facebook",
    href: "https://web.facebook.com/theuncommonnigeriagirl",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  // {
  //   label: "Twitter",
  //   href: "#",
  //   icon: (
  //     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
  //       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  //     </svg>
  //   ),
  // },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@a4s_collection",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/a4s_collection/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { openPage } = usePageOverlay();
  const [footerRef, inView] = useInView(0.05);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer
      ref={footerRef}
      style={{ background: "#011c40", color: "#fff", fontFamily: "system-ui, sans-serif" }}
    >
      {/* Main footer body */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 48px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "48px 40px",
        }}>

          {/* Brand column */}
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0s, transform 0.7s ease 0s",
          }}>
            <img
              src="/logo.png"
              alt="A4's Collection"
              style={{ height: 40, marginBottom: 20, filter: "brightness(0) invert(1)", opacity: 0.9 }}
            />
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: "0 0 28px", maxWidth: 240 }}>
              Timeless clothing crafted with intention. Built for real life, designed to last.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", gap: 12 }}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 36, height: 36,
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "none", transition: "all 0.3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items], colIdx) => (
            <div key={title} style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.7s ease ${(colIdx + 1) * 0.1}s, transform 0.7s ease ${(colIdx + 1) * 0.1}s`,
            }}>
              <p style={{
                fontSize: 9, fontWeight: 800, letterSpacing: "0.28em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
                margin: "0 0 20px",
              }}>
                {title}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        const page = linkPageMap[item];
                        if (page) openPage(page);
                      }}
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.6)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        transition: "color 0.25s",
                        padding: 0,
                        font: "inherit"
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter column */}
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}>
            <p style={{
              fontSize: 9, fontWeight: 800, letterSpacing: "0.28em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
              margin: "0 0 20px",
            }}>
              Stay in the Loop
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: "0 0 20px" }}>
              New drops, exclusive offers, and style notes — straight to your inbox.
            </p>

            {subscribed ? (
              <p style={{ fontSize: 13, color: "#fbbf24", fontWeight: 600 }}>
                ✓ You're on the list!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "#fff", fontSize: 13,
                    padding: "11px 14px", outline: "none",
                    transition: "border-color 0.3s",
                    width: "100%", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.55)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.18)"}
                />
                <button type="submit"
                  style={{
                    background: "#fff", color: "#011c40",
                    fontSize: 10, fontWeight: 800,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    border: "none", padding: "11px 0", cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={e => e.target.style.background = "#fbbf24"}
                  onMouseLeave={e => e.target.style.background = "#fff"}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "20px 24px",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.7s ease 0.5s",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between",
          gap: 12,
        }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>
            © {new Date().getFullYear()} A4's Collection. All rights reserved. Developed by <a href="\">Brillo Digitals</a>
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Use"].map((t) => (
              <a key={t} href="#"
                onClick={() => {
                  const page = linkPageMap[t];
                  if (page) openPage(page);
                }}
                style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.25s" }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}