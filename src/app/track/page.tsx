import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackPageClient from "./TrackPageClient";

export default function TrackPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream min-h-screen py-12 px-4">
        <Suspense
          fallback={
            <div className="text-center text-muted">กำลังโหลด...</div>
          }
        >
          <TrackPageClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
