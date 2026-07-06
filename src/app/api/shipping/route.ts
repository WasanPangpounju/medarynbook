import { NextResponse } from "next/server";
import { getShippingConfig } from "@/sanity/queries";

export async function GET() {
  const settings = await getShippingConfig();

  return NextResponse.json({
    registeredFee: settings?.registeredFee ?? 40,
    emsFee: settings?.emsFee ?? 80,
    freeShippingThreshold: settings?.freeShippingThreshold ?? 0,
    freeShippingActive: settings?.freeShippingActive ?? false,
  });
}
