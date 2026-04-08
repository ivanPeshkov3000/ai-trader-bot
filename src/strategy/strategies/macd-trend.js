import { macd } from '../indicators/index.js';
import { BaseStrategy } from './base-strategy.js';

/**
 * Стратегия на основе MACD (Moving Average Convergence/Divergence).
 *
 * - Гистограмма переходит из отрицательной в положительную -> BUY
 * - Гистограмма переходит из положительной в отрицательную -> SELL
 * - Иначе -> HOLD
 */
export class MacdTrendStrategy extends BaseStrategy {
  constructor({ fastPeriod = 12, slowPeriod = 26, signalPeriod = 9 } = {}) {
    super('MACD Trend');
    this.fastPeriod = fastPeriod;
    this.slowPeriod = slowPeriod;
    this.signalPeriod = signalPeriod;
    this.prevHistogram = new Map();
  }

  evaluate({ prices, tick }) {
    const result = macd(prices, this.fastPeriod, this.slowPeriod, this.signalPeriod);

    if (result == null) {
      return { action: 'HOLD', confidence: 0, reasoning: 'Недостаточно данных для MACD' };
    }

    const { histogram, macdLine, signalLine } = result;
    const prevHist = this.prevHistogram.get(tick.symbol);
    this.prevHistogram.set(tick.symbol, histogram);

    if (prevHist == null) {
      return { action: 'HOLD', confidence: 0, reasoning: 'Нет предыдущей гистограммы MACD' };
    }

    // Переход гистограммы через ноль
    if (prevHist <= 0 && histogram > 0) {
      const strength = Math.min(Math.abs(histogram) * 50, 0.3);
      return {
        action: 'BUY',
        confidence: Math.min(0.85, 0.55 + strength),
        reasoning: `MACD: бычье пересечение (MACD=${macdLine.toFixed(3)}, Signal=${signalLine.toFixed(3)})`,
      };
    }

    if (prevHist >= 0 && histogram < 0) {
      const strength = Math.min(Math.abs(histogram) * 50, 0.3);
      return {
        action: 'SELL',
        confidence: Math.min(0.85, 0.55 + strength),
        reasoning: `MACD: медвежье пересечение (MACD=${macdLine.toFixed(3)}, Signal=${signalLine.toFixed(3)})`,
      };
    }

    return {
      action: 'HOLD',
      confidence: 0.3,
      reasoning: `MACD: без пересечения (histogram=${histogram.toFixed(3)})`,
    };
  }
}
