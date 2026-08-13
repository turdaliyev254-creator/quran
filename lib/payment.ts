export type PaymentMethod = "payme" | "click";

export interface CheckoutResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/**
 * Payme "checkout.paycom.uz" tezkor to'lov havolasini yasaydi.
 * Format hujjati: https://developer.help.paycom.uz/initsializatsiya-platezhey/
 * PAYME_ACCOUNT_FIELD — Payme kassa kabinetida sozlangan "account" maydon nomi
 * (masalan "order_id" yoki "category"), standart: "category".
 */
export function buildPaymeCheckoutUrl(categoryId: string, amountSom: number): CheckoutResult {
  const merchantId = process.env.PAYME_MERCHANT_ID;
  if (!merchantId) {
    return { ok: false, error: "PAYME_MERCHANT_ID sozlanmagan" };
  }
  const accountField = process.env.PAYME_ACCOUNT_FIELD || "category";
  const amountTiyin = Math.round(amountSom * 100);
  const params = `m=${merchantId};ac.${accountField}=${categoryId};a=${amountTiyin}`;
  const encoded = Buffer.from(params, "utf-8").toString("base64");
  return { ok: true, url: `https://checkout.paycom.uz/${encoded}` };
}

/**
 * Click "Invoice" tezkor to'lov havolasini yasaydi.
 * Format hujjati: https://docs.click.uz/en/click-request/
 * Aniq parametr nomlari Click merchant kabinetidagi xizmat sozlamalariga qarab farq qilishi
 * mumkin — bu yerdagi shakl eng ko'p tarqalgan variant.
 */
export function buildClickCheckoutUrl(categoryId: string, amountSom: number): CheckoutResult {
  const merchantId = process.env.CLICK_MERCHANT_ID;
  const serviceId = process.env.CLICK_SERVICE_ID;
  if (!merchantId || !serviceId) {
    return { ok: false, error: "CLICK_MERCHANT_ID yoki CLICK_SERVICE_ID sozlanmagan" };
  }
  const url = new URL("https://my.click.uz/services/pay");
  url.searchParams.set("service_id", serviceId);
  url.searchParams.set("merchant_id", merchantId);
  url.searchParams.set("amount", String(amountSom));
  url.searchParams.set("transaction_param", categoryId);
  return { ok: true, url: url.toString() };
}

export function buildCheckoutUrl(
  method: PaymentMethod,
  categoryId: string,
  amountSom: number
): CheckoutResult {
  if (amountSom <= 0) return { ok: false, error: "Summa noto'g'ri" };
  return method === "payme"
    ? buildPaymeCheckoutUrl(categoryId, amountSom)
    : buildClickCheckoutUrl(categoryId, amountSom);
}
