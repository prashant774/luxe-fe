import { createContext, useState, useEffect } from "react";

const WISHLIST_KEY = "luxe_wishlist";
const RECENT_KEY = "luxe_recent";

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => load(WISHLIST_KEY));
  const [recentlyViewed, setRecentlyViewed] = useState(() => load(RECENT_KEY));

  useEffect(() => {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids)); } catch {}
  }, [ids]);

  useEffect(() => {
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed)); } catch {}
  }, [recentlyViewed]);

  const itemCount = ids.length;

  function isWishlisted(id) {
    return ids.includes(id);
  }

  function toggleItem(id) {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function removeItem(id) {
    setIds((prev) => prev.filter((x) => x !== id));
  }

  function trackView(id) {
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 5));
  }

  return (
    <WishlistContext.Provider value={{ ids, itemCount, isWishlisted, toggleItem, removeItem, recentlyViewed, trackView }}>
      {children}
    </WishlistContext.Provider>
  );
}
