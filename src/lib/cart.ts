export type CartItem = {
  title: string;
  price: number;
  quantity: number;
  bg?: string;
  coverImage?: string | null;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  zipcode: string;
};

export type DeliveryMethod = "registered" | "ems";
export type PaymentMethod = "promptpay" | "transfer";

export type OrderSummary = {
  orderId: string;
  customer: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  promoCode?: string;
  createdAt: string;
};

const CART_KEY = "medaryn_cart";
const PENDING_ORDER_KEY = "medaryn_pending_order_id";
const LAST_ORDER_KEY = "medaryn_last_order";

export const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  registered: 40,
  ems: 80,
};

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(CART_KEY), []);
}

export function setCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find((entry) => entry.title === item.title);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  setCart(cart);
  return cart;
}

export function clearCart() {
  setCart([]);
}

export function updateCartItem(title: string, quantity: number) {
  const cart = getCart();
  if (quantity <= 0) {
    setCart(cart.filter((item) => item.title !== title));
    return;
  }
  const existing = cart.find((item) => item.title === title);
  if (existing) {
    existing.quantity = quantity;
  }
  setCart(cart);
}

export function removeFromCart(title: string) {
  const cart = getCart();
  setCart(cart.filter((item) => item.title !== title));
}

export function getPendingOrderId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PENDING_ORDER_KEY);
}

export function setPendingOrderId(orderId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_ORDER_KEY, orderId);
}

export function clearPendingOrderId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_ORDER_KEY);
}

export function getLastOrder(): OrderSummary | null {
  if (typeof window === "undefined") return null;
  return safeParse(window.localStorage.getItem(LAST_ORDER_KEY), null);
}

export function setLastOrder(order: OrderSummary) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
}

export function generateOrderId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MDB-${stamp}${random}`;
}

export function formatBaht(amount: number) {
  return amount.toLocaleString("th-TH");
}
