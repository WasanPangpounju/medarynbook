"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";

type Props = {
  bookId: string;
  title: string;
  price: number;
  coverImage?: string | null;
  bg?: string;
  inStock?: boolean;
  stockQuantity?: number;
};

export default function BookDetailActions({
  bookId: _bookId,
  title,
  price,
  coverImage,
  bg,
  inStock = true,
  stockQuantity,
}: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    if (!stockQuantity || stockQuantity <= 0) {
      alert("ขออภัย หนังสือเล่มนี้หมดชั่วคราว อยู่ระหว่างจัดพิมพ์เพิ่ม");
      return;
    }
    addToCart({ title, price, quantity, coverImage, bg });
  }

  function handleBuyNow() {
    if (!stockQuantity || stockQuantity <= 0) {
      alert("ขออภัย หนังสือเล่มนี้หมดชั่วคราว อยู่ระหว่างจัดพิมพ์เพิ่ม");
      return;
    }
    addToCart({ title, price, quantity, coverImage, bg });
    router.push("/checkout");
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-ink">จำนวน</span>
        <div className="flex items-center gap-0 rounded-full border border-black/10">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="px-4 py-2 text-base leading-none text-ink disabled:text-muted"
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
            className="px-4 py-2 text-base leading-none text-ink disabled:text-muted"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || !stockQuantity || stockQuantity <= 0}
          className="flex-1 rounded-full border border-sage px-6 py-3 text-sm font-medium text-sage transition-colors hover:bg-sage-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          เพิ่มในตะกร้า
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!inStock || !stockQuantity || stockQuantity <= 0}
          className="flex-1 rounded-full bg-sage px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-sage/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {inStock ? "สั่งซื้อทันที" : "สินค้าหมด"}
        </button>
      </div>
    </div>
  );
}
