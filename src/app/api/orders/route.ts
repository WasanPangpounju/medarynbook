import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sanityClient } from "@/sanity/client";
import { findOrder } from "@/sanity/queries";
import { sendNewOrderEmail, sendCustomerConfirmationEmail } from "@/lib/email";

type OrderItemInput = {
  bookTitle: string;
  price: number;
  quantity: number;
};

type CreateOrderInput = {
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
  items?: OrderItemInput[];
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  total?: number;
  promoCode?: string;
};

export async function POST(request: Request) {
  if (!sanityClient) {
    return NextResponse.json({ error: "Sanity is not configured" }, { status: 503 });
  }

  const body = (await request.json()) as CreateOrderInput;

  if (!body.orderId || !body.customerName || !body.customerEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const itemsWithKeys = (body.items ?? []).map((item: OrderItemInput) => ({
    ...item,
    _key: randomUUID(),
  }));

  const doc = await sanityClient.create({
    _type: "order",
    orderId: body.orderId,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    shippingAddress: body.shippingAddress,
    deliveryMethod: body.deliveryMethod,
    paymentMethod: body.paymentMethod,
    items: itemsWithKeys,
    subtotal: body.subtotal,
    shippingFee: body.shippingFee,
    discount: body.discount,
    total: body.total,
    promoCode: body.promoCode,
    status: "pending_payment",
    createdAt: new Date().toISOString(),
  });

  const orderPayload = {
    orderId: body.orderId,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    shippingAddress: body.shippingAddress,
    deliveryMethod: body.deliveryMethod,
    paymentMethod: body.paymentMethod,
    items: body.items,
    subtotal: body.subtotal,
    shippingFee: body.shippingFee,
    discount: body.discount,
    total: body.total,
    promoCode: body.promoCode,
  };

  const results = await Promise.allSettled([
    sendNewOrderEmail(orderPayload),
    sendCustomerConfirmationEmail(orderPayload),
    decrementStock(body.items ?? [], sanityClient),
    incrementPromoUsage(body.promoCode, sanityClient),
  ]);

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      const labels = [
        "sendNewOrderEmail",
        "sendCustomerConfirmationEmail",
        "decrementStock",
        "incrementPromoUsage",
      ];
      console.error(`${labels[i]} failed:`, result.reason);
    }
  });

  return NextResponse.json({ order: doc }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!sanityClient) {
    return NextResponse.json({ error: "Sanity is not configured" }, { status: 503 });
  }

  const body = (await request.json()) as {
    orderId: string;
    slipImageUrl?: string;
    notes?: string;
    status?: string;
  };

  if (!body.orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const results = await sanityClient.fetch<{ _id: string }[]>(
    `*[_type == "order" && orderId == $orderId]{_id}`,
    { orderId: body.orderId }
  );
  const id = results[0]?._id;
  if (!id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const updated = await sanityClient
    .patch(id)
    .set({
      slipImageUrl: body.slipImageUrl,
      notes: body.notes,
      status: body.status ?? "payment_submitted",
    })
    .commit();

  return NextResponse.json({ order: updated });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId") ?? undefined;
  const email = searchParams.get("email") ?? undefined;
  const phone = searchParams.get("phone") ?? undefined;

  const order = await findOrder(orderId, email, phone);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

async function decrementStock(
  items: OrderItemInput[],
  client: NonNullable<typeof sanityClient>
) {
  for (const item of items) {
    const results = await client.fetch<{ _id: string; stockQuantity?: number }[]>(
      `*[_type == "book" && title == $title][0..0]{_id, stockQuantity}`,
      { title: item.bookTitle }
    );
    const book = results[0];
    if (!book) continue;
    const newQty = Math.max(0, (book.stockQuantity ?? 0) - item.quantity);
    await client.patch(book._id).set({ stockQuantity: newQty }).commit();
  }
}

async function incrementPromoUsage(
  code: string | undefined,
  client: NonNullable<typeof sanityClient>
) {
  if (!code) return;
  const results = await client.fetch<{ _id: string }[]>(
    `*[_type == "promoCode" && code == $code][0..0]{_id}`,
    { code: code.toUpperCase() }
  );
  const promo = results[0];
  if (!promo) return;
  await client.patch(promo._id).inc({ usedCount: 1 }).commit();
}
