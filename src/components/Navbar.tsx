import Image from "next/image";
import Link from "next/link";
import NavbarCartButton from "./NavbarCartButton";

const navLinks = [
  { label: "ร้านหนังสือ", href: "/bookstore" },
  { label: "ลิขสิทธิ์", href: "/rights" },
  { label: "กิจกรรม", href: "/events" },
  { label: "นักเขียน", href: "/authors" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/5">
      <div className="mx-auto max-w-6xl px-6 h-[64px] flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Medaryn Book"
            width={110}
            height={38}
            style={{ height: 38, width: "auto" }}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink hover:text-sage transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <NavbarCartButton />
      </div>
    </header>
  );
}
