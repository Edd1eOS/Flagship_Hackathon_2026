const AUD_FORMATTER = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

export function formatAud(amount: number): string {
  return AUD_FORMATTER.format(amount);
}
