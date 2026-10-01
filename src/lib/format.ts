export const AED = (n: number) =>
  `AED ${n.toLocaleString("en-AE", { maximumFractionDigits: 0 })}`;

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function daysUntil(iso: string, from: Date = new Date("2026-07-02")): number {
  const due = new Date(iso);
  const ms = due.getTime() - from.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}