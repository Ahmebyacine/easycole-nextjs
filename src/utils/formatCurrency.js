export function formatCurrencyDZD(amount) {
  if (amount == null || isNaN(amount)) return "0 د.ج";

  return new Intl.NumberFormat("ar-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
  }).format(amount);
}
