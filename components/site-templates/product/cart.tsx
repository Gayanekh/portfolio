"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

// The Product template's cart, shared by the header (the count) and the shop
// section (Add to Cart). Adding shows a short message at the bottom.

interface Cart {
  count: number;
  add: (quantity: number, title: string) => void;
}

const CartContext = createContext<Cart>({ count: 0, add: () => {} });
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number>(undefined);

  const add = (quantity: number, title: string) => {
    setCount((n) => n + quantity);
    setMessage(`Added ${quantity} × ${title} to cart`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 2200);
  };

  return (
    <CartContext.Provider value={{ count, add }}>
      {children}
      {/* Stays at the bottom of the screen while the page scrolls */}
      <div className="pointer-events-none sticky bottom-6 z-50 h-0">
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <AnimatePresence>
            {message && (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className="rounded-full bg-foreground px-5 py-3 text-[13px] text-card"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </CartContext.Provider>
  );
}

// The cart icon and count in the header.
export function CartCount() {
  const { count } = useCart();
  return (
    <span className="flex items-center gap-1" aria-label={`Cart, ${count} items`}>
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21.5 7H6.2" />
        <circle cx="10" cy="20" r="1.6" />
        <circle cx="17" cy="20" r="1.6" />
      </svg>
      <motion.span key={count} initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
        {count}
      </motion.span>
    </span>
  );
}

// Quantity, from 1 to 99.
export function QuantityPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const clamp = (n: number) => Math.min(99, Math.max(1, Number.isFinite(n) ? n : 1));
  const step = "h-full w-10 cursor-pointer border-0 bg-transparent text-lg text-foreground disabled:cursor-default disabled:opacity-30";
  return (
    <div className="flex h-[46px] items-center rounded-full border-[1.5px] border-foreground">
      <button type="button" aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(clamp(value - 1))} className={step}>
        −
      </button>
      <input
        type="number"
        min={1}
        max={99}
        value={value}
        aria-label="Quantity"
        onChange={(event) => onChange(clamp(parseInt(event.target.value, 10)))}
        className="w-8 border-0 bg-transparent text-center text-[13px] text-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(clamp(value + 1))} className={step}>
        +
      </button>
    </div>
  );
}
