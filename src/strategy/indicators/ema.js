/**
 * Exponential Moving Average (EMA).
 * Придаёт больший вес последним значениям, быстрее реагирует на изменения.
 */
export function ema(values, period) {
  if (values.length < period) return null;

  const k = 2 / (period + 1);

  // Начальное значение — SMA первых `period` элементов
  let avg = 0;
  for (let i = 0; i < period; i++) {
    avg += values[i];
  }
  avg /= period;

  // Далее считаем EMA по оставшимся значениям
  for (let i = period; i < values.length; i++) {
    avg = values[i] * k + avg * (1 - k);
  }

  return avg;
}
