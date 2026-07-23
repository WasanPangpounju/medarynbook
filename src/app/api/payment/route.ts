import { NextResponse } from "next/server";
import { getPaymentConfig } from "@/sanity/queries";
import { payment as fallbackPayment } from "@/data/content";

export async function GET() {
  const settings = await getPaymentConfig();

  return NextResponse.json({
    promptPayNumber: settings?.promptPayNumber || fallbackPayment.promptPayNumber,
    qrCodeImage: settings?.qrCodeImage || fallbackPayment.qrCodeImage,
    bankAccounts:
      settings?.bankAccounts && settings.bankAccounts.length > 0
        ? settings.bankAccounts
        : fallbackPayment.bankAccounts,
  });
}
