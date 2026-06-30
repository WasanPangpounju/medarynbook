import { Icon } from "./icons";
import { contact as defaultContact } from "@/data/content";
import type { ContactEntry } from "@/data/content";

type ContactSectionProps = {
  contact?: ContactEntry[];
};

export default function ContactSection({ contact = defaultContact }: ContactSectionProps) {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl text-ink mb-8 text-center">ติดต่อเรา</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contact.map((entry) => (
          <div
            key={entry.label}
            className="border border-black/10 rounded-xl p-8 text-center flex flex-col items-center gap-2"
          >
            <Icon name={entry.icon} size={28} className="text-sage mb-2" />
            <p className="text-ink font-medium">{entry.label}</p>
            {entry.value.map((line) => (
              <p key={line} className="text-muted text-sm">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
