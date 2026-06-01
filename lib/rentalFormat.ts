export function formatLkr(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-LK')}`;
}

export function toIsoUtc(date: Date): string {
  return date.toISOString();
}

export function formatDisplayDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
