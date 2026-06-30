"use client";

import { useState } from "react";
import Link from "next/link";
import PaymentNoticeModal from "./bookstore/PaymentNoticeModal";

function PackageSearchIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" />
      <circle cx="16.5" cy="16.5" r="2.5" />
      <path d="m21 21-1.5-1.5" />
      <path d="M8 7h8M8 11h5" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
      <path d="M14 8H8M16 12H8M13 16H8" />
    </svg>
  );
}

export default function ShoppingActionBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/track"
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
        style={{ background: "#EBF2EC", color: "#2d5a3d" }}
      >
        <PackageSearchIcon />
        ติดตามสั่งซื้อ
      </Link>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
        style={{ background: "#4E7358" }}
      >
        <ReceiptIcon />
        แจ้งชำระเงิน
      </button>

      {isModalOpen && (
        <PaymentNoticeModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
