import type { CurrencyCode } from './storage';

/** USD list prices are converted to LKR with this fixed rate (no external API). */
export const DEFAULT_USD_TO_LKR = 300;

export const SHOWROOM_BIKE_ROTATE_MS = 15_000;

export function formatUsdPrice(usd: number): string {
  return `$${usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function formatLkrPrice(usd: number): string {
  const lkr = Math.round(usd * DEFAULT_USD_TO_LKR);
  return `Rs. ${lkr.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`;
}

export function formatBikePrice(usd: number, currency: CurrencyCode): string {
  if (currency === 'USD') {
    return formatUsdPrice(usd);
  }
  return formatLkrPrice(usd);
}
