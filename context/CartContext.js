'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'huff-puff-cart-v1';

function makeLineKey(item, options = []) {
  const optKey = options
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((o) => `${o.groupName}:${o.name}`)
    .join('|');
  return `${item.id}::${optKey}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  function addItem(menuItem, quantity = 1, selectedOptions = [], instructions = '') {
    const key = makeLineKey(menuItem, selectedOptions);
    setItems((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [
        ...prev,
        {
          key,
          menuItemId: menuItem.id,
          name: menuItem.name,
          image: menuItem.image,
          basePrice: menuItem.price,
          selectedOptions,
          instructions,
          quantity,
        },
      ];
    });
    setOpen(true);
  }

  function updateQty(key, delta) {
    setItems((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, quantity: Math.max(0, l.quantity + delta) } : l))
        .filter((l) => l.quantity > 0),
    );
  }

  function setQty(key, quantity) {
    setItems((prev) =>
      prev.map((l) => (l.key === key ? { ...l, quantity: Math.max(0, quantity) } : l)).filter((l) => l.quantity > 0),
    );
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((l) => l.key !== key));
  }

  function clear() { setItems([]); }

  const derived = useMemo(() => {
    const lineTotal = (l) =>
      (l.basePrice + l.selectedOptions.reduce((s, o) => s + (o.price || 0), 0)) * l.quantity;
    const subtotal = items.reduce((s, l) => s + lineTotal(l), 0);
    const itemCount = items.reduce((s, l) => s + l.quantity, 0);
    return { subtotal, itemCount, lineTotal };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setOpen(true),
        closeCart: () => setOpen(false),
        addItem,
        updateQty,
        setQty,
        removeItem,
        clear,
        ...derived,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
