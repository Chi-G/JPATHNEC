export function formatPrice(amount?: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) {
  const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options || {};
  const value = Number(amount ?? 0);
  return '₦' + value.toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits });
}

export default formatPrice;
