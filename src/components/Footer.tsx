import Image from "next/image";
import { Icon } from "./icons";
import { footer as defaultFooter } from "@/data/content";
import type { FooterContent } from "@/data/content";

type FooterProps = {
  footer?: FooterContent;
};

export default function Footer({ footer = defaultFooter }: FooterProps) {
  return (
    <footer className="bg-[#1C1C1A] text-white py-12">
      <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-6">
        <Image
          src="/images/logo.png"
          alt="Medaryn Book"
          width={110}
          height={38}
          style={{ height: 32, width: "auto" }}
        />

        <div className="flex items-center gap-6">
          {footer.social.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/50 hover:text-sage-mid transition-colors text-sm"
            >
              <Icon name={social.icon} size={16} />
              {social.label}
            </a>
          ))}
        </div>

        <p className="text-white/30 text-xs">
          {footer.copyright ?? "© 2569 Medaryn Book. All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
