import { ema } from './ema.js';

/**
 * MACD (Moving Average Convergence/Divergence).
 * Показывает соотношение двух EMA и сигнальную линию.
 *
 * Возвращает: { macdLine, signalLine, histogram } или null.
 */
export function macd(values, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (values.length < slowPeriod + signalPeriod) return null;

  // Считаем MACD-линию для каждого возможного подотрезка
  const macdSeries = [];
  for (let i = slowPeriod; i <= values.length; i++) {
    const slice = values.slice(0, i);
    const fastEma = ema(slice, fastPeriod);
    const slowEma = ema(slice, slowPeriod);
    if (fastEma == null || slowEma == null) continue;
    macdSeries.push(fastEma - slowEma);
  }

  if (macdSeries.length < signalPeriod) return null;

  const macdLine = macdSeries[macdSeries.length - 1];
  const signalLine = ema(macdSeries, signalPeriod);

  if (signalLine == null) return null;

  return {
    macdLine,
    signalLine,
    histogram: macdLine - signalLine,
  };
}
