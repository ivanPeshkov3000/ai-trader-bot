import { sma } from '../indicators/index.js';
import { BaseStrategy } from './base-strategy.js';

/**
 * Стратегия пересечения скользящих средних (SMA Crossover).
 *
 * - Когда быстрая SMA пересекает медленную снизу вверх -> BUY
 * - Когда быстрая SMA пересекает медленную сверху вниз -> SELL
 * - Иначе -> HOLD
 */
export class SmaCrossoverStrategy extends BaseStrategy {
  constructor({ fastPeriod = 10, slowPeriod = 30 } = {}) {
    super('SMA Crossover');
    this.fastPeriod = fastPeriod;
    this.slowPeriod = slowPeriod;
    this.prevFast = new Map();
    this.prevSlow = new Map();
  }

  evaluate({ prices, tick }) {
    const fastSma = sma(prices, this.fastPeriod);
    const slowSma = sma(prices, this.slowPeriod);

    if (fastSma == null || slowSma == null) {
      return { action: 'HOLD', confidence: 0, reasoning: 'Недостаточно данных для SMA' };
    }

    const prevFast = this.prevFast.get(tick.symbol);
    const prevSlow = this.prevSlow.get(tick.symbol);

    this.prevFast.set(tick.symbol, fastSma);
    this.prevSlow.set(tick.symbol, slowSma);

    if (prevFast == null || prevSlow == null) {
      return { action: 'HOLD', confidence: 0, reasoning: 'Нет предыдущих SMA для сравнения' };
    }

    const wasBelowOrEqual = prevFast <= prevSlow;
    const isAbove = fastSma > slowSma;

    const wasAboveOrEqual = prevFast >= prevSlow;
    const isBelow = fastSma < slowSma;

    if (wasBelowOrEqual && isAbove) {
      const spread = (fastSma - slowSma) / slowSma;
      const confidence = Math.min(0.9, 0.6 + spread * 10);
      return {
        action: 'BUY',
        confidence,
        reasoning: `SMA${this.fastPeriod} пересекла SMA${this.slowPeriod} снизу вверх (${fastSma.toFixed(2)} > ${slowSma.toFixed(2)})`,
      };
    }

    if (wasAboveOrEqual && isBelow) {
      const spread = (slowSma - fastSma) / slowSma;
      const confidence = Math.min(0.9, 0.6 + spread * 10);
      return {
        action: 'SELL',
        confidence,
        reasoning: `SMA${this.fastPeriod} пересекла SMA${this.slowPeriod} сверху вниз (${fastSma.toFixed(2)} < ${slowSma.toFixed(2)})`,
      };
    }

    return { action: 'HOLD', confidence: 0.3, reasoning: 'Нет пересечения SMA' };
  }
}
