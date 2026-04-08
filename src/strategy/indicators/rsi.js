/**
 * Relative Strength Index (RSI).
 * Осциллятор, показывающий силу текущего тренда (0–100).
 *   > 70 — перекупленность (возможен разворот вниз)
 *   < 30 — перепроданность (возможен разворот вверх)
 */
export function rsi(values, period = 14) {
  // Нужно минимум (period + 1) значений, чтобы получить `period` дельт
  if (values.length < period + 1) return null;

  let avgGain = 0;
  let avgLoss = 0;

  // Первичный расчёт средних за `period`
  for (let i = 1; i <= period; i++) {
    const change = values[i] - values[i - 1];
    if (change > 0) avgGain += change;
    else avgLoss += Math.abs(change);
  }
  avgGain /= period;
  avgLoss /= period;

  // Сглаживание (Wilder's smoothing)
  for (let i = period + 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}
