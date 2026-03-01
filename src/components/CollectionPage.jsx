import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "./Cart";
import { useProducts } from "./ProductContext";

export default function CollectionPage() {
    const { id } = useParams();
    const [visible, setVisible] = useState(false);
    const { collections = [], products = [], loading } = useProducts();

    const collection = collections.find(c => c.id === id);
    const collectionProducts = products.filter(p => p.categoryId === id);

    useEffect(() => {
        window.scrollTo(0, 0);
        setVisible(false);
        setTimeout(() => setVisible(true), 100);
    }, [id]);

    if (loading) return null;
    if (!collection) return <div className="pt-32 text-center">Collection not found.</div>;

    return (
        <div className="bg-[#f7f5f2] min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-8 text-[0.65rem] uppercase tracking-widest font-bold text-[#a8a29e]">
                    <Link to="/" className="hover:text-[#011c40] transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-[#011c40]">Collections</span>
                    <span>/</span>
                    <span className="text-[#011c40]">{collection.name}</span>
                </nav>

                {/* Header */}
                <header className={`mb-12 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h1 className="text-4xl md:text-6xl font-serif italic text-[#011c40] mb-4">
                        {collection.name}
                    </h1>
                    <p className="text-[#78716c] max-w-2xl text-sm leading-relaxed">
                        {collection.description}
                    </p>
                    <div className="mt-8 flex items-center gap-4 text-[0.65rem] font-black uppercase tracking-widest text-[#011c40]">
                        <span>{collectionProducts.length} Items</span>
                        <div className="w-12 h-px bg-[#011c40]/20" />
                    </div>
                </header>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {collectionProducts.map((product, index) => (
                        <CollectionProductCard
                            key={product.id}
                            product={product}
                            index={index}
                            visible={visible}
                        />
                    ))}
                </div>

                {collectionProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-[#78716c] font-serif italic">No products found in this collection.</p>
                        <Link to="/" className="inline-block mt-6 text-[0.7rem] uppercase tracking-widest font-black text-[#011c40] border-b border-[#011c40] pb-1">Return Home</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function CollectionProductCard({ product, index, visible }) {
    const { addItem, items } = useCart();
    const inCart = items.some(i => i.id === product.id);

    return (
        <div
            className={`group transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4] bg-[#e7e5e4]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {product.badge && (
                    <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[0.6rem] font-black uppercase tracking-widest text-[#011c40] backdrop-blur-sm">
                        {product.badge}
                    </span>
                )}

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-[#011c40]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (!inCart) addItem({ ...product, quantity: 1 });
                        }}
                        className="w-full py-3 bg-white text-[#011c40] text-[0.65rem] font-black uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-[#011c40] hover:text-white"
                    >
                        {inCart ? "In Cart" : "Quick Add +"}
                    </button>
                </div>
            </Link>

            <div className="mt-4 flex justify-between items-start">
                <div>
                    <Link to={`/product/${product.id}`} className="block text-sm font-medium text-[#1c1917] hover:text-[#c9974c] transition-colors">
                        {product.name}
                    </Link>
                    <p className="text-[0.65rem] text-[#78716c] uppercase tracking-widest mt-1">
                        {useProducts().collections.find(c => c.id === product.categoryId)?.name}
                    </p>
                </div>
                <p className="text-sm font-bold text-[#011c40]">₦{product.price.toLocaleString()}</p>
            </div>
        </div>
    );
}
