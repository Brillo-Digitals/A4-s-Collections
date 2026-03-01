import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "./Cart";
import { useProducts } from "./ProductContext";

export default function ProductPage() {
    const { id } = useParams();
    const { products = [], collections = [], loading } = useProducts();
    const { addItem, items } = useCart();

    const product = products.find(p => p.id === id);
    const collection = product ? collections.find(c => c.id === product.categoryId) : null;

    const [activeImg, setActiveImg] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (product) {
            setActiveImg(0);
            setSelectedSize(product.sizes?.[0] || "");
            setSelectedColor(product.colors?.[0]?.name || "");
            setTimeout(() => setVisible(true), 100);
        }
    }, [id, product]);

    if (loading) return null;
    if (!product) return <div className="pt-32 text-center">Product not found.</div>;

    const inCart = items.some(i => i.id === product.id);

    // Suggested products logic (same category, excluding current)
    const suggested = products
        .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="bg-[#f7f5f2] min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-10 text-[0.65rem] uppercase tracking-widest font-bold text-[#a8a29e]">
                    <Link to="/" className="hover:text-[#011c40] transition-colors">Home</Link>
                    <span>/</span>
                    <Link to={`/collection/${product.categoryId}`} className="hover:text-[#011c40] transition-colors">{collection?.name}</Link>
                    <span>/</span>
                    <span className="text-[#011c40]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

                    {/* Left: Image */}
                    <div className={`lg:col-span-7 transition-all duration-1000 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                        <div className="aspect-[4/5] bg-[#e7e5e4] overflow-hidden mb-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className={`lg:col-span-5 transition-all duration-1000 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                        <p className="text-[#c9974c] text-[0.7rem] font-black uppercase tracking-[0.3em] mb-3">
                            {product.badge || "Premium Collection"}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif italic text-[#011c40] mb-6 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-2xl font-bold text-[#011c40]">₦{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-[#a8a29e] line-through">₦{product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>

                        <p className="text-[#78716c] text-sm leading-relaxed mb-10 pb-8 border-b border-[#011c40]/10">
                            {product.description}
                        </p>

                        {/* Selectors */}
                        <div className="space-y-8 mb-10">
                            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                                <div>
                                    <label className="block text-[0.65rem] font-black uppercase tracking-widest text-[#011c40] mb-4">Size</label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-12 h-12 text-xs font-bold transition-all border ${selectedSize === size ? 'bg-[#011c40] text-white border-[#011c40]' : 'bg-transparent text-[#011c40] border-[#011c40]/20 hover:border-[#011c40]'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {Array.isArray(product.colors) && product.colors.length > 0 && (
                                <div>
                                    <label className="block text-[0.65rem] font-black uppercase tracking-widest text-[#011c40] mb-4">Color</label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map(color => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all ${selectedColor === color.name ? 'border-[#c9974c]' : 'border-transparent'}`}
                                                title={color.name}
                                            >
                                                <div className="w-full h-full rounded-full" style={{ background: color.hex }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => addItem({ ...product, selectedSize, selectedColor })}
                            className="w-full py-5 bg-[#011c40] text-white text-[0.7rem] font-black uppercase tracking-[0.2em] hover:bg-[#c9974c] transition-colors duration-300 mb-6"
                        >
                            {inCart ? "In Bag" : "Add to Shopping Bag"}
                        </button>

                        {/* Perks */}
                        <div className="space-y-4 pt-6 border-t border-[#011c40]/10">
                            {Array.isArray(product.perks) && product.perks.map((perk, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9974c" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#78716c]">{perk}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Suggested Section */}
                {suggested.length > 0 && (
                    <section className="mt-32">
                        <h2 className="text-2xl font-serif italic text-[#011c40] mb-12">You might also like...</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {suggested.map(p => (
                                <Link key={p.id} to={`/product/${p.id}`} className="group block">
                                    <div className="aspect-[3/4] bg-[#e7e5e4] overflow-hidden mb-4">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="text-xs font-bold text-[#1c1917] uppercase tracking-widest group-hover:text-[#c9974c] transition-colors">
                                        {p.name}
                                    </h3>
                                    <p className="text-xs text-[#011c40] mt-1 opacity-70">₦{p.price.toLocaleString()}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
