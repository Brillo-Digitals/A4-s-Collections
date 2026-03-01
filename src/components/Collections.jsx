import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "./ProductContext";

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

export default function Collections() {
  const [showAll, setShowAll] = useState(false);
  const [sectionRef, inView] = useInView(0.1);

  const { collections = [], products: allProducts = [], loading } = useProducts();

  if (loading) return null; // Or a skeleton

  const allCollections = collections.map(col => ({
    ...col,
    itemCount: allProducts.filter(p => p.categoryId === col.id).length
  }));

  const visibleCollections = showAll ? allCollections : allCollections.slice(0, 5);

  return (
    <section id="collections" ref={sectionRef} className="w-full px-4 sm:px-8 md:px-12 py-12 md:py-16 bg-[#011c40]">

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 md:mb-8 gap-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#f0ebe3] tracking-tight leading-none italic font-serif">
          The <span className="not-italic font-sans font-bold text-[#c9974c]">Collections</span>
        </h2>
        <p className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] text-[#6b7a8d] font-bold">
          Explore curated styles for every moment
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 auto-rows-[220px] sm:auto-rows-[280px]">
        {visibleCollections.map((col, i) => (
          <Link
            key={col.id}
            to={`/collection/${col.id}`}
            className={`
              relative group overflow-hidden cursor-pointer
              bg-[#1a2232]
              transition-all duration-700 ease-out
              ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}
              ${i === 0 ? "col-span-2 lg:col-span-2 lg:row-span-2 h-full" : ""}
            `}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            {/* Background Image */}
            <img
              src={col.image}
              alt={col.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#011c40]/90 via-[#011c40]/30 to-transparent transition-opacity duration-500 opacity-60 group-hover:opacity-80" />

            {/* Content */}
            <div className={`
              absolute bottom-0 left-0 p-4 sm:p-6 w-full
              transition-transform duration-500 transform
              group-hover:-translate-y-1
            `}>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#c9974c] mb-1 font-black">
                {col.itemCount} Pieces
              </p>
              <h3 className={`
                text-[#f0ebe3] font-serif italic mb-1 transition-all duration-500
                ${i === 0 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}
              `}>
                {col.name}
              </h3>
              <div className="w-8 h-px bg-[#c9974c] group-hover:w-16 transition-all duration-500" />
            </div>

            {/* Hover Accent */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9974c" strokeWidth="1.5">
                <path d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {allCollections.length > 5 && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 bg-transparent border border-[#c9974c] text-[#c9974c] text-[0.7rem] uppercase tracking-widest font-black hover:bg-[#c9974c] hover:text-[#011c40] transition-all duration-300"
          >
            {showAll ? "View Less" : "View All Collections"}
          </button>
        </div>
      )}
    </section>
  );
}
