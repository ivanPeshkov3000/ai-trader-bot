import { sma } from './sma.js';

/**
 * Bollinger Bands.
 * Полосы на основе SMA ± (multiplier * стандартное отклонение).
 * Используются для оценки волатильности и экстремумов цены.
 *
 * Возвращает: { upper, middle, lower, bandwidth } или null.
 */
export function bollinger(values, period = 20, multiplier = 2) {
  if (values.length < period) return null;

  const middle = sma(values, period);
  if (middle == null) return null;

  const slice = values.slice(-period);
  const variance = slice.reduce((acc, v) => acc + (v - middle) ** 2, 0) / period;
  const stdDev = Math.sqrt(variance);

  const upper = middle + multiplier * stdDev;
  const lower = middle - multiplier * stdDev;

  return {
    upper,
    middle,
    lower,
    bandwidth: upper - lower,
  };
}
