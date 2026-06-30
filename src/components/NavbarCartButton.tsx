"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart } from "@/lib/cart";

export default function NavbarCartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
      setCount(total);
    };
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  return (
    <Link
      href="/checkout"
      className="border border-black/15 text-sm px-4 py-1.5 rounded-full hover:bg-sage-light transition-colors"
    >
      ตะกร้า ({count})
    </Link>
  );
}
