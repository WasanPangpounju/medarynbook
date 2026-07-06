import { sanityClient } from "./client";

export const booksQuery = `*[_type == "book"] | order(_createdAt asc) {
  "id": _id,
  "createdAt": _createdAt,
  title,
  author,
  price,
  originalPrice,
  badge,
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt,
  url,
  bg,
  category,
  isPromotion,
  isFeatured,
  inStock,
  stockQuantity
}`;

export const promosQuery = `*[_type == "promo"] | order(_createdAt asc) {
  title,
  description,
  cta,
  bgColor,
  btnColor,
  url
}`;

export const slidesQuery = `*[_type == "slide"] | order(order asc) {
  "src": image.asset->url,
  "alt": image.alt,
  caption,
  url
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  hero,
  promoBar,
  shopping,
  rights,
  contact,
  footer
}`;

export const moodsQuery = `*[_type == "mood" && isActive == true] | order(order asc) { "label": label, _id }`;

const REVALIDATE_SECONDS = 60;

async function fetchSanity<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query, params ?? {}, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch {
    return null;
  }
}

export type SanityBook = {
  id: string;
  createdAt: string;
  title: string;
  author?: string;
  price?: number;
  originalPrice?: number;
  badge?: string | null;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  url?: string;
  bg?: string;
  category?: string;
  isPromotion?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  stockQuantity?: number;
  adaptationStatus?: string;
  adaptationType?: string;
  logline?: string;
  availableLanguages?: string[];
};

export type SanityBookDetail = {
  id: string;
  title: string;
  author?: string;
  price?: number;
  originalPrice?: number;
  badge?: string | null;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  bg?: string;
  category?: string;
  synopsis?: string;
  publishYear?: string;
  publisher?: string;
  shopeeUrl?: string;
  mebUrl?: string;
  naiinUrl?: string;
  isPromotion?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  stockQuantity?: number;
};

export type SanityPromo = {
  title: string;
  description?: string;
  cta?: string;
  bgColor?: string;
  btnColor?: string;
  url?: string;
};

export type SanitySlide = {
  src: string;
  alt?: string;
  caption?: string;
  url?: string;
};

export type SanitySiteSettings = {
  hero?: Record<string, string>;
  promoBar?: {
    isActive?: boolean;
    badge?: string;
    text?: string;
    code?: string;
    shipping?: string;
    bgColor?: string;
    textColor?: string;
    url?: string;
  };
  shopping?: Array<{
    name?: string;
    desc?: string;
    tag?: string;
    url?: string;
    icon?: string;
  }>;
  rights?: {
    label?: string;
    title?: string;
    desc?: string;
    genres?: string[];
    ctaText?: string;
    ctaUrl?: string;
  };
  contact?: Array<{
    icon?: string;
    label?: string;
    value?: string[];
  }>;
  footer?: {
    social?: Array<{
      label?: string;
      icon?: string;
      href?: string;
    }>;
    copyright?: string;
  };
};

export async function getBooks() {
  return fetchSanity<SanityBook[]>(booksQuery);
}

export async function getPromos() {
  return fetchSanity<SanityPromo[]>(promosQuery);
}

export async function getSlides() {
  return fetchSanity<SanitySlide[]>(slidesQuery);
}

export async function getSiteSettings() {
  return fetchSanity<SanitySiteSettings>(siteSettingsQuery);
}

export async function getMoods() {
  return fetchSanity<Array<{ label: string; _id: string }>>(moodsQuery);
}

export type SanityShippingConfig = {
  registeredFee?: number;
  emsFee?: number;
  freeShippingThreshold?: number;
  freeShippingActive?: boolean;
};

export async function getShippingConfig() {
  return fetchSanity<SanityShippingConfig>(
    `*[_type == "siteSettings"][0].shipping {
      registeredFee, emsFee, freeShippingThreshold, freeShippingActive
    }`
  );
}

export type SanityPromoCondition = {
  conditionType: "minAmount" | "minQuantity" | "none";
  value: number;
  errorMessage?: string;
};

export type SanityPromoCode = {
  _id: string;
  code: string;
  description?: string;
  discountType: "percent" | "fixed" | "gift" | "freeshipping";
  discountValue: number;
  giftDescription?: string;
  conditions?: SanityPromoCondition[];
  isActive: boolean;
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
};

export async function getPromoCodeByCode(code: string) {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<SanityPromoCode | null>(
      `*[_type == "promoCode" && code == $code][0] {
        _id, code, description, discountType, discountValue,
        giftDescription, conditions, isActive, maxUses, usedCount, expiresAt
      }`,
      { code },
      { cache: "no-store" }
    );
  } catch {
    return null;
  }
}

export type SanityBadgeStyle = {
  label: string;
  bgColor?: string;
  textColor?: string;
};

export async function getBadgeStyles() {
  return fetchSanity<SanityBadgeStyle[]>(
    `*[_type == "badgeStyle"] { label, bgColor, textColor }`
  );
}

const bookByIdQuery = `*[_type == "book" && _id == $id][0] {
  "id": _id,
  title,
  author,
  price,
  originalPrice,
  badge,
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt,
  bg,
  category,
  synopsis,
  publishYear,
  publisher,
  shopeeUrl,
  mebUrl,
  naiinUrl,
  isPromotion,
  isFeatured,
  inStock,
  stockQuantity
}`;

const booksByAuthorQuery = `*[_type == "book" && author == $author && _id != $id] | order(_createdAt asc) [0..2] {
  "id": _id,
  "createdAt": _createdAt,
  title,
  author,
  price,
  originalPrice,
  badge,
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt,
  bg,
  category,
  isPromotion,
  isFeatured,
  inStock,
  stockQuantity
}`;

export async function getBookById(id: string) {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<SanityBookDetail | null>(
      bookByIdQuery,
      { id },
      { cache: "force-cache", next: { revalidate: REVALIDATE_SECONDS } }
    );
  } catch {
    return null;
  }
}

export async function getBooksByAuthor(author: string, excludeId: string) {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<SanityBook[]>(
      booksByAuthorQuery,
      { author, id: excludeId },
      { cache: "force-cache", next: { revalidate: REVALIDATE_SECONDS } }
    );
  } catch {
    return null;
  }
}

export type SanityOrderItem = {
  bookTitle: string;
  price: number;
  quantity: number;
};

export type SanityOrder = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: {
    address?: string;
    subdistrict?: string;
    district?: string;
    province?: string;
    zipcode?: string;
  };
  deliveryMethod?: "registered" | "ems";
  paymentMethod?: "promptpay" | "transfer";
  items?: SanityOrderItem[];
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  total?: number;
  promoCode?: string;
  status?: string;
  slipImageUrl?: string;
  notes?: string;
  createdAt?: string;
};

const orderFieldsProjection = `{
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  deliveryMethod,
  paymentMethod,
  items,
  subtotal,
  shippingFee,
  discount,
  total,
  promoCode,
  status,
  slipImageUrl,
  notes,
  createdAt
}`;

export async function findOrder(
  orderId?: string,
  email?: string,
  phone?: string
) {
  if (!sanityClient) return null;
  if (!orderId && !email && !phone) return null;
  try {
    const query = `*[_type == "order" && (
      ($orderId != "" && orderId == $orderId) ||
      ($email != "" && customerEmail == $email) ||
      ($phone != "" && customerPhone == $phone)
    )] | order(_createdAt desc) [0] ${orderFieldsProjection}`;
    return await sanityClient.fetch<SanityOrder | null>(
      query,
      { orderId: orderId ?? "", email: email ?? "", phone: phone ?? "" },
      { cache: "no-store" }
    );
  } catch {
    return null;
  }
}

export type SanityRightsBook = {
  id: string;
  title: string;
  author?: string;
  bg?: string;
  coverImage?: string | null;
  badge?: string | null;
  adaptationStatus: "sold" | "available" | "translation";
  adaptationType?: string;
  logline?: string;
  category?: string;
  availableLanguages?: string[];
};

export async function getRightsBooks() {
  return fetchSanity<SanityRightsBook[]>(
    `*[_type == "book" && adaptationStatus in ["sold","available","translation"]] | order(adaptationStatus asc) {
      "id": _id, title, author, bg,
      "coverImage": coverImage.asset->url,
      badge, adaptationStatus, adaptationType,
      logline, category, availableLanguages
    }`
  );
}

export type SanityAuthor = {
  id: string;
  nameTh: string;
  nameEn?: string;
  penName?: string;
  slug: string;
  photo?: string;
  photoAlt?: string;
  biographyTh?: string;
  biographyEn?: string;
  genres?: string[];
  languages?: string[];
  worksCount?: number;
  adaptationsCount?: number;
  totalSales?: string;
  awards?: Array<{ title: string; year?: string; icon?: string }>;
  social?: {
    facebook?: string;
    tiktok?: string;
    instagram?: string;
    youtube?: string;
  };
  featuredWorks?: Array<{
    id: string;
    title: string;
    author?: string;
    price?: number;
    originalPrice?: number;
    badge?: string | null;
    coverImage?: string | null;
    bg?: string;
    category?: string;
    adaptationStatus?: string;
    adaptationType?: string;
    logline?: string;
    inStock?: boolean;
  }>;
};

export async function getAuthors() {
  return fetchSanity<SanityAuthor[]>(
    `*[_type == "author" && isActive == true] | order(order asc) {
      "id": _id,
      nameTh, nameEn, penName,
      "slug": slug.current,
      "photo": photo.asset->url,
      "photoAlt": photo.alt,
      biographyTh, biographyEn,
      genres, languages,
      worksCount, adaptationsCount, totalSales,
      awards, social
    }`
  );
}

export async function getAuthorBySlug(slug: string) {
  return fetchSanity<SanityAuthor | null>(
    `*[_type == "author" && slug.current == $slug && isActive == true][0] {
      "id": _id,
      nameTh, nameEn, penName,
      "slug": slug.current,
      "photo": photo.asset->url,
      "photoAlt": photo.alt,
      biographyTh, biographyEn,
      genres, languages,
      worksCount, adaptationsCount, totalSales,
      awards, social,
      "featuredWorks": featuredWorks[]->{
        "id": _id,
        title, author, price, originalPrice, badge,
        "coverImage": coverImage.asset->url,
        bg, category, adaptationStatus, adaptationType,
        logline, inStock, stockQuantity
      }
    }`,
    { slug }
  );
}

export async function getBooksByAuthorRef(authorId: string) {
  return fetchSanity<SanityBook[]>(
    `*[_type == "book" && authorRef._ref == $authorId] | order(_createdAt asc) {
      "id": _id,
      title, author, price, originalPrice, badge,
      "coverImage": coverImage.asset->url,
      bg, category, adaptationStatus, adaptationType,
      logline, inStock, isPromotion, stockQuantity
    }`,
    { authorId }
  );
}

export type SanityEvent = {
  id: string;
  title: string;
  eventType?: string;
  date?: string;
  timeStart?: string;
  timeEnd?: string;
  location?: string;
  description?: string;
  registerUrl?: string;
  image?: string;
  isAnnounced?: boolean;
};

export type SanitySocialPost = {
  id: string;
  platform: string;
  caption?: string;
  url?: string;
  thumbnail?: string;
  likes?: string;
  publishedAt?: string;
  isVideo?: boolean;
};

export async function getEvents() {
  return fetchSanity<SanityEvent[]>(
    `*[_type == "event"] | order(date asc) {
      "id": _id,
      title, eventType, date, timeStart, timeEnd,
      location, description, registerUrl,
      "image": image.asset->url,
      isAnnounced
    }`
  );
}

export async function getSocialPosts() {
  return fetchSanity<SanitySocialPost[]>(
    `*[_type == "socialPost" && isActive == true] | order(order asc) {
      "id": _id,
      platform, caption, url,
      "thumbnail": thumbnail.asset->url,
      likes, publishedAt, isVideo
    }`
  );
}
