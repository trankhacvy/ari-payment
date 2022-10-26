export function formatNumber(
  number: number,
  options?: Intl.NumberFormatOptions
) {
  return Intl.NumberFormat('us', options).format(number);
}
