import { createContext, useContext, useState, useCallback } from "react";

const PageOverlayContext = createContext(null);

export function PageOverlayProvider({ children }) {
  const [activePage, setActivePage] = useState(null); // null = closed

  const openPage = useCallback((page) => setActivePage(page), []);
  const closePage = useCallback(() => setActivePage(null), []);

  return (
    <PageOverlayContext.Provider value={{ activePage, openPage, closePage }}>
      {children}
    </PageOverlayContext.Provider>
  );
}
export function usePageOverlay() {
  const ctx = useContext(PageOverlayContext);
  if (!ctx) throw new Error("usePageOverlay must be used inside <PageOverlayProvider>");
  return ctx;
}