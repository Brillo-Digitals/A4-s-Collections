import { useState } from "react";
import { useProducts } from "./ProductContext";

const EXPECTED_HASH = "51ad3134dea0f0b5e3c001c6ab165dcc1f80d65e412d6fc3b7911d936da9272d";

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminPage() {
    const { products, collections, updateData, loading } = useProducts();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [loginError, setLoginError] = useState("");

    const [activeTab, setActiveTab] = useState("products");
    const [newItem, setNewItem] = useState({ name: "", description: "", price: "", image: "" });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isSaving, setIsSaving] = useState(false);

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const hash = await hashPassword(passwordInput);
        if (hash === EXPECTED_HASH) {
            setIsAuthenticated(true);
            setLoginError("");
        } else {
            setLoginError("Invalid password. Access denied.");
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.image) {
            showMessage("Name and Image Link are required", "error");
            return;
        }

        setIsSaving(true);
        try {
            let newProducts = [...products];
            let newCollections = [...collections];

            if (activeTab === "products") {
                const newId = `prod-${Date.now()}`;
                newProducts.push({
                    id: newId,
                    name: newItem.name,
                    price: parseFloat(newItem.price) || 0,
                    description: newItem.description,
                    image: newItem.image
                });
            } else {
                const newId = `col-${Date.now()}`;
                newCollections.push({
                    id: newId,
                    name: newItem.name,
                    description: newItem.description,
                    image: newItem.image
                });
            }

            const success = await updateData(newProducts, newCollections);
            if (success) {
                showMessage(`Successfully added ${activeTab === 'products' ? 'product' : 'collection'}`);
                setNewItem({ name: "", description: "", price: "", image: "" });
            } else {
                showMessage("Failed to save to database", "error");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

        setIsSaving(true);
        try {
            let newProducts = [...products];
            let newCollections = [...collections];

            if (type === "product") {
                newProducts = newProducts.filter(p => p.id !== id);
            } else {
                newCollections = newCollections.filter(c => c.id !== id);
            }

            const success = await updateData(newProducts, newCollections);
            if (success) {
                showMessage(`Successfully deleted ${type}`);
            } else {
                showMessage("Failed to delete item", "error");
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                        {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading data...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-10">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-gray-500 hover:text-black transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                        {message.type === 'error' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        )}
                        {message.text}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'products' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Manage Products
                        </button>
                        <button
                            onClick={() => setActiveTab('collections')}
                            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'collections' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Manage Collections
                        </button>
                    </div>

                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Add New {activeTab === 'products' ? 'Product' : 'Collection'}</h2>
                        <form onSubmit={handleAddItem} className="space-y-4 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                    required
                                />
                            </div>

                            {activeTab === 'products' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newItem.description}
                                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none h-24 resize-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image Link (URL) *</label>
                                <input
                                    type="url"
                                    value={newItem.image}
                                    onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : `Add ${activeTab === 'products' ? 'Product' : 'Collection'}`}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">Existing {activeTab === 'products' ? 'Products' : 'Collections'}</h2>
                    </div>

                    <ul className="divide-y divide-gray-200">
                        {(activeTab === 'products' ? products : collections).map(item => (
                            <li key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md bg-gray-100" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                                        {item.price !== undefined && <p className="text-sm font-medium mt-1">${item.price}</p>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(item.id, activeTab === 'products' ? 'product' : 'collection')}
                                    disabled={isSaving}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </li>
                        ))}
                        {(activeTab === 'products' ? products : collections).length === 0 && (
                            <li className="p-8 text-center text-gray-500">No items found</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
