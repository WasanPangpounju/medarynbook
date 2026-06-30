import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Medaryn Book — Studio",
  description: "Sanity Studio สำหรับจัดการเนื้อหา Medaryn Book",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
