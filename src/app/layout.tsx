import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Medaryn Book",
  description: "วรรณกรรมร่วมสมัยจากนักเขียนไทย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className={`${kanit.className} min-h-full flex flex-col bg-cream text-ink`}>
        {children}
      </body>
    </html>
  );
}
