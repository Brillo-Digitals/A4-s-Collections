import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Collections from "./components/Collections"
import About from "./components/About"
import FeaturedProducts from "./components/FeaturedProducts"
import NewArrivals from "./components/NewArrivals"
import { CartProvider, CartUI } from "./components/Cart";
import Footer from "./components/Footer"
import { PageOverlayProvider } from "./components/PageOverlayContext"
import PageOverlay from "./components/PageOverlay"
import { ProductProvider } from "./components/ProductContext"

// Home Component to group everything on the homepage
function Home() {
  return (
    <>
      <Hero />
      <Collections />
      <About />
      <NewArrivals />
      <FeaturedProducts />
    </>
  )
}

import CollectionPage from "./components/CollectionPage"
import ProductPage from "./components/ProductPage"

function App() {
  return (
    <ProductProvider>
      <PageOverlayProvider>
        <CartProvider>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection/:id" element={<CollectionPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>

          <Footer />
          <CartUI />
          <PageOverlay />
        </CartProvider>
      </PageOverlayProvider>
    </ProductProvider>
  )
}

export default App
