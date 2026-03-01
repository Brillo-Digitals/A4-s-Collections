import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext(null);

const JSONBIN_URL = "https://api.jsonbin.io/v3/b/69a31557d0ea881f40e2457b";
const MASTER_KEY = "$2a$10$JruLnd1mqpfFhrU6YZGGtu3n3fJ8C/zDwCG/XnYH/iJWDLxx6Gtha";

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Append '/latest' and a timestamp to the URL to bypass any caching
                const cacheBuster = `nocache=${Date.now()}`;
                const url = `${JSONBIN_URL}/latest?${cacheBuster}`;

                const response = await fetch(url, {
                    headers: {
                        "X-Master-Key": MASTER_KEY,
                        "X-Bin-Meta": "true"
                    }
                });

                if (!response.ok) throw new Error(`Fetch failed with status: ${response.status}`);

                const jsonData = await response.json();
                const record = jsonData.record || jsonData;

                if (record.products && Array.isArray(record.products)) {
                    setProducts(record.products);
                }
                if (record.collections && Array.isArray(record.collections)) {
                    setCollections(record.collections);
                }

            } catch (err) {
                console.error("ProductContext Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <ProductContext.Provider value={{ products, collections, loading, error }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) throw new Error("useProducts must be used within a ProductProvider");
    return context;
};
