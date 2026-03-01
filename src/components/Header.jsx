import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./Cart";
import { usePageOverlay } from "./PageOverlayContext";
import { useProducts } from "./ProductContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/#collections" },
  { label: "About Us", page: "about" },
  { label: "FAQ", page: "faq" },
  { label: "Contact Us", page: "contact" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchInputRef = useRef(null);
  const { products = [], collections = [], loading } = useProducts();
  const { open, setOpen } = useCart();
  const { openPage } = usePageOverlay();
  const navigate = useNavigate();

  const handleLinkClick = (e, link) => {
    if (link.page) {
      e.preventDefault();
      openPage(link.page);
      setMenuOpen(false);
    } else if (link.href.startsWith("/#")) {
      const hash = link.href.split("#")[1];
      const el = document.getElementById(hash);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY > lastScrollY && currentY > 80 && !searchOpen) {
        setHidden(true);
        setMenuOpen(false);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, searchOpen]);

  // Search Logic
  useEffect(() => {
    if (searchQuery.trim().length > 1 && products.length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        collections.find(c => c.id === p.categoryId)?.name.toLowerCase().includes(query)
      ).slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products, collections]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          ${hidden ? "-translate-y-full" : "translate-y-0"}
          ${scrolled || searchOpen
            ? "bg-[#011c40]/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
            : "bg-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 group">
              <img
                src="/logo.png"
                alt="A4's Collection logo"
                className="h-8 sm:h-9 md:h-11 transition-opacity duration-300 group-hover:opacity-80"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href || "#"}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="relative px-3 lg:px-4 py-2 text-[0.78rem] font-medium tracking-[0.12em] uppercase text-white/70 hover:text-white transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3 right-3 h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                </a>
              ))}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(!searchOpen)}
                className={`transition-colors duration-300 p-2 ${searchOpen ? 'text-amber-300' : 'text-white/60 hover:text-white'}`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
              <button
                aria-label="Cart"
                className="relative text-white/60 hover:text-white transition-colors duration-300 p-2"
                onClick={() => setOpen(true)}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span className="absolute top-1 right-1 w-1.75 h-1.75 rounded-full bg-amber-300" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-1">
              <button
                aria-label="Search"
                onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
                className={`p-2 transition-colors ${searchOpen ? 'text-amber-300' : 'text-white/70'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
              <button
                aria-label="Cart"
                onClick={() => setOpen(true)}
                className="relative p-2 text-white/70"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-300" />
              </button>
              <button
                aria-label="Toggle menu"
                onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
                className="p-2 text-white/70"
              >
                <div className="w-5 flex flex-col gap-1.25">
                  <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                  <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                  <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <div className={`
          absolute top-full left-0 right-0 bg-[#011c40] border-t border-white/10 overflow-hidden transition-all duration-500
          ${searchOpen ? "max-h-[500px] border-b border-white/10" : "max-h-0"}
        `}>
          <div className="max-w-3xl mx-auto px-5 py-8">
            <div className="relative mb-8">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, collections..."
                className="w-full bg-transparent border-b-2 border-white/20 py-4 text-xl md:text-2xl text-white font-light focus:border-amber-300 outline-none transition-colors placeholder-white/20"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-16 h-20 bg-white/10 overflow-hidden shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">{p.name}</h4>
                      <p className="text-white/40 text-[0.65rem] uppercase tracking-widest">
                        {collections.find(c => c.id === p.categoryId)?.name}
                      </p>
                      <p className="text-amber-300 text-xs mt-1 font-bold">₦{p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : searchQuery.length > 1 ? (
              <p className="text-white/40 text-center py-4 font-serif italic text-sm">No products found for "{searchQuery}"</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                <p className="text-white/40 text-[0.6rem] uppercase tracking-widest w-full mb-2">Suggested Collections</p>
                {collections.slice(0, 3).map(c => (
                  <Link
                    key={c.id}
                    to={`/collection/${c.id}`}
                    onClick={() => setSearchOpen(false)}
                    className="px-4 py-2 border border-white/10 hover:border-amber-300 text-white/60 hover:text-white text-[0.65rem] uppercase tracking-widest transition-all"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={`
          md:hidden overflow-hidden transition-all duration-500 bg-[#011c40]
          ${menuOpen ? "max-h-[100vh] opacity-100 border-t border-white/10" : "max-h-0 opacity-0"}
        `}>
          <nav className="flex flex-col px-5 py-8 gap-1">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href || "#"}
                onClick={(e) => handleLinkClick(e, link)}
                className="flex items-center justify-between py-4 text-sm font-medium tracking-widest uppercase text-white/60 hover:text-white border-b border-white/5 transition-all"
              >
                {link.label}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            ))}
          </nav>
        </div>
      </header>
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Header;
