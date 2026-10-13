"use client";

import { useState, type FormEvent } from "react";
import { Button } from "../core/blocks";
import { QuantityPicker, useCart } from "./cart";

// The Product template's own small pieces, used by its sections.

export function InstagramLink() {
  return (
    <a href="#" aria-label="Instagram" className="text-foreground">
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    </a>
  );
}

export function LoginLink() {
  return (
    <a href="#" className="text-foreground no-underline">
      Login
    </a>
  );
}

// Quantity and Add to Cart, for the product called `title`.
export function AddToCartForm({ title }: { title: string }) {
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    add(quantity, title);
  };
  return (
    <form onSubmit={submit} className="mt-4 flex max-w-[34rem] gap-2">
      <QuantityPicker value={quantity} onChange={setQuantity} />
      <Button type="submit" width="fill">
        Add to Cart
      </Button>
    </form>
  );
}
