# A4's Collection 👗

A modern, responsive e-commerce website for **A4's Collection** — a contemporary clothing brand built with React, TypeScript, and Tailwind CSS. Products are dynamically loaded from a remote JSON file, making it easy to update your catalog without touching the codebase.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| [React](https://reactjs.org/) | UI component framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Remote JSON](https://your-cdn-or-api.com/products.json) | Dynamic product catalog |

---

## 📁 Project Structure

```
a4s-collection/
├── public/
│   └── index.html
├── src/
│   ├── assets/             # Images, fonts, icons
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── Cart.tsx
│   ├── hooks/
│   │   └── useProducts.ts  # Fetches from remote JSON
│   ├── types/
│   │   └── product.ts      # TypeScript interfaces
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   └── ProductDetail.tsx
│   ├── App.tsx
│   └── main.tsx
├── .env
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/a4s-collection.git
cd a4s-collection

# Install dependencies
npm install

# Start the development server
npm run dev
```

The site will be live at `http://localhost:5173`

---

## 🛍️ Remote Product Catalog

Products are fetched from a remote JSON file, so your store stays up to date without redeployment.

### Setting the Product URL

In your `.env` file:

```env
VITE_PRODUCTS_URL=https://your-cdn-or-api.com/products.json
```

### Product JSON Schema

Your remote JSON file should follow this structure:

```json
[
  {
    "id": "001",
    "name": "Classic Linen Blazer",
    "category": "Tops",
    "price": 120.00,
    "currency": "USD",
    "description": "A relaxed fit linen blazer perfect for any occasion.",
    "sizes": ["XS", "S", "M", "L", "XL"],
    "colors": ["Beige", "Black", "Olive"],
    "images": [
      "https://your-cdn.com/images/blazer-front.jpg",
      "https://your-cdn.com/images/blazer-back.jpg"
    ],
    "inStock": true,
    "featured": true,
    "tags": ["blazer", "linen", "casual"]
  }
]
```

### TypeScript Interface

```ts
// src/types/product.ts
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  sizes: string[];
  colors: string[];
  images: string[];
  inStock: boolean;
  featured?: boolean;
  tags?: string[];
}
```

### Fetching Products (Custom Hook)

```ts
// src/hooks/useProducts.ts
import { useState, useEffect } from "react";
import { Product } from "../types/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_PRODUCTS_URL);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
```

---

## 🧪 Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking
```

---

## 🌍 Deployment

### Build for Production

```bash
npm run build
```

The output will be in the `/dist` folder, ready to deploy to:

- [Vercel](https://vercel.com) — `vercel --prod`
- [Netlify](https://netlify.com) — Drag & drop `/dist`
- [GitHub Pages](https://pages.github.com)

> ⚠️ Make sure to add your `VITE_PRODUCTS_URL` environment variable in your hosting provider's dashboard.

---

## 🎨 Customization

### Brand Colors (tailwind.config.ts)

```ts
theme: {
  extend: {
    colors: {
      brand: {
        primary: "#011C40",
        accent: "#011C40",
        light: "#f5f0eb",
      },
    },
  },
}
```

---

## 📄 License

This project is licensed under the [GNU License](LICENSE).

---

## ✉️ Contact


---

> *Crafted with care for every detail — just like our clothing.* ✨