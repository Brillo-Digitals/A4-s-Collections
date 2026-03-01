import { createContext, useContext, useState, useEffect, useRef } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("a4_cart") || "[]"); }
    catch { return []; }
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("a4_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice,
      open, setOpen  // ← Add these to the context value
    }}>
      <div className="min-h-screen bg-[#011c40] text-white"> {children} </div>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

function generateReceipt(items, total, ref) {
  const date = new Date().toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
  return `
╔══════════════════════════════════════╗
         A4'S COLLECTION
         Payment Receipt
══════════════════════════════════════
  Ref: ${ref}
  Date: ${date}
══════════════════════════════════════
  ITEMS ORDERED:
${items.map((i) => `  • ${i.qty}x ${i.name}\n    ₦${(i.price * i.qty).toLocaleString()}`).join("\n")}
══════════════════════════════════════
  TOTAL: ₦${total.toLocaleString()}
══════════════════════════════════════
  Payment to:
  Bank: Opay
  Acc: 8133752548
  Name: Tokode Roseline Adewola
══════════════════════════════════════
  Thank you for shopping with us! 🛍️
  A4's Collection
╚══════════════════════════════════════╝
`.trim();
}

const WA_NUMBER = "2348147294918";

function buildWAMessage(items, total, ref) {
  const lines = items.map((i) => `• ${i.qty}x ${i.name} — ₦${(i.price * i.qty).toLocaleString()}`).join("\n");
  return encodeURIComponent(
    `Hello A4's Collection! 👋\n\nI'd like to place the following order:\n\n${lines}\n\n*Total: ₦${total.toLocaleString()}*\n\nOrder Ref: ${ref}\n\nPlease confirm availability before I make payment to:\n🏦 Opay | 8133752548 | Tokode Roseline Adewola`
  );
}
export function CartUI() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice, open, setOpen } = useCart();

  const [stage, setStage] = useState("cart");
  const [bounce, setBounce] = useState(false);
  const [receiptText, setReceiptText] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const prevCount = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevCount.current) {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }
    prevCount.current = totalItems;
  }, [totalItems]);

  const handleCheckout = () => setStage("checkout");

  const handleConfirm = () => {
    const ref = "A4-" + Date.now().toString(36).toUpperCase();
    setOrderRef(ref);
    const receipt = generateReceipt(items, totalPrice, ref);
    setReceiptText(receipt);
    setStage("receipt");
  };

  const handleWhatsApp = () => {
    const ref = orderRef || "A4-" + Date.now().toString(36).toUpperCase();
    const msg = buildWAMessage(items, totalPrice, ref);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  const handleDownloadReceipt = () => {
    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `A4-Receipt-${orderRef}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setStage("cart"), 400);
  };

  const handleDone = () => {
    clearCart();
    handleClose();
  };

  const S = styles;

  return (
    <>
      {/* ── Floating Cart Button ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open cart"
        style={{
          ...S.fab,
          transform: bounce ? "scale(1.25)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        {totalItems > 0 && (
          <span style={S.badge}>{totalItems > 99 ? "99+" : totalItems}</span>
        )}
      </button>

      {/* ── Backdrop ── */}
      <div
        onClick={handleClose}
        style={{
          ...S.backdrop,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      />

      {/* ── Drawer ── */}
      <div style={{
        ...S.drawer,
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.42s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Drag handle */}
        <div style={S.handle} />

        {/* ── STAGE: CART ── */}
        {stage === "cart" && (
          <>
            <div style={S.drawerHeader}>
              <div>
                <p style={S.drawerEyebrow}>Your Bag</p>
                <h2 style={S.drawerTitle}>{totalItems} {totalItems === 1 ? "Item" : "Items"}</h2>
              </div>
              <button onClick={handleClose} style={S.closeBtn} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div style={S.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(1,28,64,0.2)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <p style={{ margin: "16px 0 4px", fontSize: 16, fontWeight: 600, color: "#292524" }}>Your bag is empty</p>
                <p style={{ fontSize: 13, color: "#a8a29e" }}>Add some items to get started</p>
                <button onClick={handleClose} style={{ ...S.primaryBtn, marginTop: 24, padding: "12px 32px" }}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div style={S.itemList}>
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} updateQty={updateQty} removeItem={removeItem} />
                  ))}
                </div>

                <div style={S.drawerFooter}>
                  <div style={S.totalRow}>
                    <span style={{ fontSize: 13, color: "#78716c", letterSpacing: "0.05em" }}>SUBTOTAL</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "#011c40", fontFamily: "Georgia, serif" }}>
                      ₦{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button onClick={handleCheckout} style={S.primaryBtn}>
                    Proceed to Checkout →
                  </button>
                  <button onClick={() => { clearCart(); }} style={S.ghostBtn}>Clear Bag</button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── STAGE: CHECKOUT ── */}
        {stage === "checkout" && (
          <>
            <div style={S.drawerHeader}>
              <div>
                <button onClick={() => setStage("cart")} style={S.backBtn}>← Back</button>
                <h2 style={S.drawerTitle}>Order Summary</h2>
              </div>
              <button onClick={handleClose} style={S.closeBtn}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div style={S.itemList}>
              {items.map((item) => (
                <div key={item.id} style={S.checkoutItem}>
                  <img src={item.image} alt={item.name} style={S.checkoutThumb} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1c1917", margin: "0 0 3px" }}>{item.qty}× {item.name}</p>
                    <p style={{ fontSize: 12, color: "#a8a29e", margin: 0 }}>{item.category}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#011c40" }}>
                    ₦{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={S.drawerFooter}>
              {/* Payment info */}
              <div style={S.paymentBox}>
                <p style={S.paymentLabel}>Payment Instructions</p>
                <p style={S.paymentLine}>After confirming, send payment to:</p>
                <div style={S.paymentDetails}>
                  <div style={S.payRow}><span>Bank</span><strong>Opay</strong></div>
                  <div style={S.payRow}><span>Account No.</span><strong>8133752548</strong></div>
                  <div style={S.payRow}><span>Account Name</span><strong>Tokode Roseline Adewola</strong></div>
                </div>
                <p style={{ fontSize: 11, color: "#78716c", marginTop: 10, lineHeight: 1.6 }}>
                  ⚠️ Wait for confirmation reply on WhatsApp before making transfer.
                </p>
              </div>

              <div style={S.totalRow}>
                <span style={{ fontSize: 13, color: "#78716c" }}>TOTAL TO PAY</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#011c40", fontFamily: "Georgia, serif" }}>
                  ₦{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <button onClick={handleConfirm} style={S.primaryBtn}>
                ✓ Confirm Order & Contact Us
              </button>
            </div>
          </>
        )}

        {/* ── STAGE: RECEIPT ── */}
        {stage === "receipt" && (
          <>
            <div style={S.drawerHeader}>
              <h2 style={S.drawerTitle}>🎉 Thank You!</h2>
              <button onClick={handleClose} style={S.closeBtn}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div style={{ padding: "0 24px", overflowY: "auto", flex: 1 }}>
              <div style={S.thanksBanner}>
                <p style={{ fontSize: 22, margin: "0 0 6px", fontFamily: "Georgia, serif", fontWeight: 300 }}>
                  Thanks for doing business with us! 🛍️
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0 }}>
                  Order Ref: <strong>{orderRef}</strong>
                </p>
              </div>

              {/* Order list */}
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#a8a29e", margin: "20px 0 12px" }}>
                Your Order
              </p>
              {items.map((item) => (
                <div key={item.id} style={S.receiptItem}>
                  <span style={{ fontSize: 13, color: "#292524" }}>
                    {item.qty}× {item.name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#011c40" }}>
                    ₦{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
              <div style={{ ...S.receiptItem, borderTop: "2px solid #011c40", marginTop: 8, paddingTop: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#011c40" }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#011c40", fontFamily: "Georgia, serif" }}>
                  ₦{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Payment reminder */}
              <div style={{ ...S.paymentBox, marginTop: 20 }}>
                <p style={S.paymentLabel}>Send Payment To</p>
                <div style={S.paymentDetails}>
                  <div style={S.payRow}><span>Bank</span><strong>Opay</strong></div>
                  <div style={S.payRow}><span>Acc No.</span><strong>8133752548</strong></div>
                  <div style={S.payRow}><span>Name</span><strong>Tokode Roseline Adewola</strong></div>
                </div>
              </div>
            </div>

            <div style={S.drawerFooter}>
              <button onClick={handleWhatsApp} style={{ ...S.primaryBtn, background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.046 22l4.946-1.379A9.943 9.943 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.188a8.163 8.163 0 01-4.16-1.14l-.298-.177-3.088.861.851-3.016-.195-.31A8.187 8.187 0 013.812 12c0-4.514 3.674-8.188 8.188-8.188 4.513 0 8.187 3.674 8.187 8.188s-3.674 8.188-8.188 8.188z" />
                </svg>
                Order via WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function CartItem({ item, updateQty, removeItem }) {
  return (
    <div style={styles.cartItem}>
      <img src={item.image} alt={item.name} style={styles.cartThumb} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1c1917", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.name}
        </p>
        <p style={{ fontSize: 11, color: "#a8a29e", margin: "0 0 8px" }}>{item.category}</p>
        <div style={styles.qtyRow}>
          <button onClick={() => updateQty(item.id, -1)} style={styles.qtyBtn}>−</button>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#011c40", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
          <button onClick={() => updateQty(item.id, 1)} style={styles.qtyBtn}>+</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <button onClick={() => removeItem(item.id)} style={styles.removeBtn} aria-label="Remove">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#011c40", fontFamily: "Georgia, serif" }}>
          ₦{(item.price * item.qty).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

const styles = {
  fab: {
    position: "fixed", bottom: 28, right: 28, zIndex: 9999,
    width: 58, height: 58, borderRadius: "50%",
    background: "#011c40", border: "none",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", boxShadow: "0 8px 30px rgba(1,28,64,0.45)",
  },
  badge: {
    position: "absolute", top: -4, right: -4,
    background: "#fbbf24", color: "#1c1917",
    fontSize: 9, fontWeight: 800,
    minWidth: 20, height: 20, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "0 5px", border: "2px solid #fff",
  },
  backdrop: {
    position: "fixed", inset: 0, zIndex: 9998,
    background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)",
  },
  drawer: {
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
    background: "#fff", borderRadius: "20px 20px 0 0",
    maxHeight: "88vh", display: "flex", flexDirection: "column",
    boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
    fontFamily: "system-ui, sans-serif",
  },
  handle: {
    width: 40, height: 4, borderRadius: 4,
    background: "#e2ddd8", margin: "12px auto 0",
  },
  drawerHeader: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    padding: "20px 24px 16px", borderBottom: "1px solid #f0ede9",
  },
  drawerEyebrow: {
    fontSize: 9, fontWeight: 800, letterSpacing: "0.25em",
    textTransform: "uppercase", color: "#a8a29e", margin: "0 0 4px",
  },
  drawerTitle: {
    fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 300,
    color: "#1c1917", margin: 0,
  },
  closeBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#a8a29e", padding: 4, display: "flex",
    transition: "color 0.2s",
  },
  backBtn: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
    color: "#a8a29e", padding: "0 0 6px", textTransform: "uppercase",
    display: "block",
  },
  itemList: {
    overflowY: "auto", flex: 1, padding: "8px 24px",
  },
  cartItem: {
    display: "flex", gap: 14, padding: "16px 0",
    borderBottom: "1px solid #f0ede9", alignItems: "flex-start",
  },
  cartThumb: {
    width: 72, height: 90, objectFit: "cover", objectPosition: "top",
    borderRadius: 4, flexShrink: 0, background: "#e7e5e4",
  },
  qtyRow: {
    display: "inline-flex", alignItems: "center", gap: 12,
    border: "1px solid #e2ddd8", borderRadius: 4, padding: "4px 10px",
  },
  qtyBtn: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: 16, color: "#011c40", fontWeight: 700, lineHeight: 1, padding: 0,
  },
  removeBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#d4cdc7", padding: 0,
  },
  drawerFooter: {
    padding: "16px 24px 28px",
    borderTop: "1px solid #f0ede9",
    display: "flex", flexDirection: "column", gap: 10,
  },
  totalRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4,
  },
  primaryBtn: {
    width: "100%", padding: "15px", background: "#011c40",
    color: "#fff", border: "none", cursor: "pointer",
    fontSize: 12, fontWeight: 800, letterSpacing: "0.15em",
    textTransform: "uppercase", transition: "background 0.3s",
  },
  ghostBtn: {
    width: "100%", padding: "12px",
    background: "none", border: "1.5px solid #e2ddd8",
    color: "#78716c", cursor: "pointer",
    fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
  },
  emptyState: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", padding: "40px 24px",
  },
  checkoutItem: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 0", borderBottom: "1px solid #f0ede9",
  },
  checkoutThumb: {
    width: 52, height: 64, objectFit: "cover", objectPosition: "top",
    borderRadius: 4, background: "#e7e5e4",
  },
  paymentBox: {
    background: "#f7f5f2", padding: "14px 16px", borderRadius: 6,
    border: "1px solid #e2ddd8",
  },
  paymentLabel: {
    fontSize: 9, fontWeight: 800, letterSpacing: "0.22em",
    textTransform: "uppercase", color: "#a8a29e", margin: "0 0 8px",
  },
  paymentLine: {
    fontSize: 12, color: "#78716c", margin: "0 0 8px",
  },
  paymentDetails: {
    display: "flex", flexDirection: "column", gap: 6,
  },
  payRow: {
    color: "#1c1917",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    fontSize: 13,
  },
  thanksBanner: {
    background: "#011c40", color: "#fff",
    padding: "20px", borderRadius: 8, marginBottom: 4, marginTop: 4,
  },
  receiptItem: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: "1px solid #f0ede9",
  },
};

