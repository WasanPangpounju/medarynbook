import type { IconName } from "@/components/icons";

export type HeroContent = {
  brand: string;
  tagline: string;
  title: string;
  titleEmphasis: string;
  titleSuffix: string;
  description: string;
  ctaPrimary: string;
  ctaPrimaryUrl?: string;
  ctaSecondary: string;
};

export type PromoBarContent = {
  isActive: boolean;
  badge?: string;
  text: string;
  code?: string;
  shipping?: string;
  bgColor?: string;
  textColor?: string;
  url?: string;
};

export type Book = {
  id?: string;
  title: string;
  author: string;
  price: string;
  originalPrice: string;
  badge: "ใหม่" | "ขายดี" | null;
  bg: string;
  coverImage?: string | null;
  url: string;
};

export const badgeStyles: Record<string, string> = {
  ใหม่: "bg-sage text-white",
  ขายดี: "bg-[#b5451b] text-white",
};

export type BadgeStyleMap = Record<string, { bgColor?: string; textColor?: string }>;

export const defaultBadgeStyleMap: BadgeStyleMap = {
  "ใหม่": { bgColor: "#4E7358", textColor: "#ffffff" },
  "ขายดี": { bgColor: "#b5451b", textColor: "#ffffff" },
};

export type Promo = {
  title: string;
  desc: string;
  cta: string;
  bg: string;
  btnColor: string;
  url: string;
};

export type Slide = {
  src: string;
  caption: string;
  url: string;
};

export type ShoppingChannel = {
  name: string;
  desc: string;
  tag: string;
  url: string;
  icon: IconName;
};

export type RightsContent = {
  label: string;
  title: string;
  desc: string;
  genres: string[];
  ctaText?: string;
  ctaUrl?: string;
};

export type ContactEntry = {
  icon: IconName;
  label: string;
  value: string[];
};

export type SocialLink = {
  label: string;
  icon: IconName;
  href: string;
};

export type FooterContent = {
  social: SocialLink[];
  copyright?: string;
};

export type BankAccount = {
  bankName: string;
  accountName?: string;
  accountNumber: string;
};

export type PaymentContent = {
  promptPayNumber: string;
  qrCodeImage: string | null;
  bankAccounts: BankAccount[];
};

export const hero: HeroContent = {
  brand: "MEDARYN.BOOK",
  tagline: "อัพเดทความสนุกก่อนใคร",
  title: "เรื่องราวที่ดีที่สุด คือ",
  titleEmphasis: "ชีวิตจริง",
  titleSuffix: "ของเรา",
  description: "เพราะเรื่องราวในหนังสือพาพวกเรามาพบกัน",
  ctaPrimary: "ติดตามคำสั่งซื้อ",
  ctaPrimaryUrl: "/track",
  ctaSecondary: "ดูทั้งหมด",
};

export const promoBar: PromoBarContent = {
  isActive: true,
  badge: "SPECIAL",
  text: "ซื้อครบ 2 เล่ม ลดเพิ่ม 15%",
  code: "PAIR15",
  shipping: "จัดส่งฟรีเมื่อซื้อครบ 399 บาท",
  bgColor: "#4E7358",
  textColor: "#ffffff",
};

export const books: Book[] = [
  {
    title: "ผ่านฟ้า ๒๕๐๕ วิวาห์เป็ดสะท้าน",
    author: "ตฤณภัทร",
    price: "166",
    originalPrice: "295",
    badge: "ใหม่",
    bg: "#3d5a48",
    url: "https://www.mebmarket.com",
  },
  {
    title: "พระนคร ๒๔๑๐ แม่สื่อตัวร้ายกับนายโปลิศ",
    author: "ตฤณภัทร",
    price: "150",
    originalPrice: "250",
    badge: "ขายดี",
    bg: "#7a6b8a",
    url: "https://www.mebmarket.com",
  },
  {
    title: "บางกอก ๒๔๑๘ วิกฤตการณ์รักร้ายของนายกระภุมพี",
    author: "ตฤณภัทร",
    price: "210",
    originalPrice: "420",
    badge: null,
    bg: "#6b7e6e",
    url: "https://www.mebmarket.com",
  },
  {
    title: "Coming Soon",
    author: "Medaryn",
    price: "",
    originalPrice: "",
    badge: null,
    bg: "#7a6b55",
    url: "https://www.mebmarket.com",
  },
];

export const promos: Promo[] = [
  {
    title: "Mid-Year Book Fair",
    desc: "ลดสูงสุด 30% สำหรับหนังสือทุกเล่ม",
    cta: "ดูโปรโมชั่น",
    bg: "#EBF2EC",
    btnColor: "#4E7358",
    url: "https://www.mebmarket.com",
  },
  {
    title: "E-Book ลดพิเศษสูงสุด 50%",
    desc: "เลือกอ่านได้ทุกที่ ทุกเวลา",
    cta: "ดูโปรโมชั่น",
    bg: "#FDF6E8",
    btnColor: "#b8860b",
    url: "https://www.mebmarket.com",
  },
];

export const slides: Slide[] = [
  {
    src: "/images/slide1.jpeg",
    caption: "ผ่านฟ้า ๒๕๐๕ วิวาห์เป็ดสะท้าน",
    url: "https://www.mebmarket.com",
  },
  {
    src: "/images/slide2.jpg",
    caption: "พระนคร ๒๔๑๐ แม่สื่อตัวร้ายกับนายโปลิศ",
    url: "https://www.mebmarket.com",
  },
  {
    src: "/images/slide3.jpg",
    caption: "บางกอก ๒๔๑๘ วิกฤตการณ์รักร้ายของนายกระภุมพี",
    url: "https://www.mebmarket.com",
  },
];

export const shopping: ShoppingChannel[] = [
  {
    name: "Shopee",
    desc: "สั่งซื้อหนังสือเล่มจัดส่งทั่วประเทศ",
    tag: "หนังสือเล่ม",
    url: "https://shopee.co.th",
    icon: "shoppingCart",
  },
  {
    name: "Meb",
    desc: "อ่าน E-Book ได้ทันทีบนแอป Meb",
    tag: "E-Book",
    url: "https://www.mebmarket.com",
    icon: "tablet",
  },
  {
    name: "Naiin",
    desc: "เลือกซื้อ E-Book ผ่าน Naiin",
    tag: "E-Book",
    url: "https://www.naiin.com",
    icon: "bookOpen",
  },
];

export const rights: RightsContent = {
  label: "MEDIA RIGHTS & ADAPTATION",
  title: "นำเรื่องราวไปต่อยอด",
  desc: "เปิดรับการต่อยอดผลงานสู่ละคร ภาพยนตร์ ซีรีส์ และสื่ออื่น ๆ พร้อมให้คำปรึกษาตลอดกระบวนการเจรจาลิขสิทธิ์",
  genres: ["ดราม่า", "โรแมนติก", "สืบสวน", "ประวัติศาสตร์", "เยาวชน"],
  ctaText: "ขอ Pitch Deck / ติดต่อลิขสิทธิ์",
};

export const contact: ContactEntry[] = [
  {
    icon: "mail",
    label: "อีเมล",
    value: ["hello@medarynbook.com", "rights@medarynbook.com"],
  },
  {
    icon: "facebook",
    label: "Facebook",
    value: ["Medaryn Book", "ตอบภายใน 24 ชั่วโมง"],
  },
  {
    icon: "mapPin",
    label: "ที่อยู่",
    value: ["กรุงเทพมหานคร", "เปิดทำการ จ–ศ 9:00–18:00"],
  },
];

export const payment: PaymentContent = {
  promptPayNumber: "",
  qrCodeImage: null,
  bankAccounts: [
    { bankName: "SCB", accountNumber: "123-4-56789-0" },
    { bankName: "KBank", accountNumber: "098-7-65432-1" },
  ],
};

export const footer: FooterContent = {
  social: [
    { label: "Facebook", icon: "facebook", href: "https://facebook.com" },
    { label: "TikTok", icon: "tiktok", href: "https://tiktok.com" },
    { label: "X", icon: "x", href: "https://x.com" },
    { label: "YouTube", icon: "youtube", href: "https://youtube.com" },
  ],
  copyright: "© 2569 Medaryn Book. All rights reserved.",
};
