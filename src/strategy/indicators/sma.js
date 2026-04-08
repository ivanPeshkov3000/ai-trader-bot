/**
 * Simple Moving Average (SMA).
 * Вычисляет среднее арифметическое последних `period` значений.
 */
export function sma(values, period) {
  if (values.length < period) return null;

  const slice = values.slice(-period);
  const sum = slice.reduce((acc, v) => acc + v, 0);
  return sum / period;
}
