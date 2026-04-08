import { rsi } from '../indicators/index.js';
import { BaseStrategy } from './base-strategy.js';

/**
 * Стратегия на основе RSI (Relative Strength Index).
 *
 * - RSI < oversoldLevel -> BUY  (перепроданность, ожидаем отскок)
 * - RSI > overboughtLevel -> SELL (перекупленность, ожидаем коррекцию)
 * - Иначе -> HOLD
 */
export class RsiReversalStrategy extends BaseStrategy {
  constructor({ period = 14, overboughtLevel = 70, oversoldLevel = 30 } = {}) {
    super('RSI Reversal');
    this.period = period;
    this.overboughtLevel = overboughtLevel;
    this.oversoldLevel = oversoldLevel;
  }

  evaluate({ prices }) {
    const currentRsi = rsi(prices, this.period);

    if (currentRsi == null) {
      return { action: 'HOLD', confidence: 0, reasoning: 'Недостаточно данных для RSI' };
    }

    if (currentRsi < this.oversoldLevel) {
      // Чем глубже перепроданность, тем выше уверенность
      const depth = (this.oversoldLevel - currentRsi) / this.oversoldLevel;
      const confidence = Math.min(0.95, 0.55 + depth);
      return {
        action: 'BUY',
        confidence,
        reasoning: `RSI = ${currentRsi.toFixed(1)} (перепроданность, порог ${this.oversoldLevel})`,
      };
    }

    if (currentRsi > this.overboughtLevel) {
      const depth = (currentRsi - this.overboughtLevel) / (100 - this.overboughtLevel);
      const confidence = Math.min(0.95, 0.55 + depth);
      return {
        action: 'SELL',
        confidence,
        reasoning: `RSI = ${currentRsi.toFixed(1)} (перекупленность, порог ${this.overboughtLevel})`,
      };
    }

    return {
      action: 'HOLD',
      confidence: 0.4,
      reasoning: `RSI = ${currentRsi.toFixed(1)} (нейтральная зона)`,
    };
  }
}
