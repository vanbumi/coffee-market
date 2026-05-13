export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `INV/${year}${month}${day}/${random}`;
}

export function calculateShippingCost(
  totalWeight: number,
  pricePerKg: number,
  minPrice: number
): number {
  const cost = totalWeight * pricePerKg;
  return Math.max(cost, minPrice);
}

export function calculateTotalWeight(items: { quantity: number }[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getDiscountPercentage(code: string): number {
  const vouchers: Record<string, number> = {
    COFFEE10: 10,
  };
  return vouchers[code] || 0;
}

export function isFreeShipping(code: string, subtotal: number): boolean {
  return code === 'GRATISONGKIR' && subtotal >= 500000;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
