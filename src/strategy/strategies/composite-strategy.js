import { BaseStrategy } from './base-strategy.js';

/**
 * Композитная стратегия — комбинирует несколько стратегий
 * через взвешенное голосование.
 *
 * Каждая стратегия получает вес (weight). Итоговое решение
 * принимается на основе суммарного взвешенного скора.
 *
 * Минимальный порог (minScoreThreshold) предотвращает сделки
 * при слабых или противоречивых сигналах.
 */
export class CompositeStrategy extends BaseStrategy {
  /**
   * @param {Array<{ strategy: BaseStrategy, weight: number }>} components
   * @param {{ minScoreThreshold?: number }} options
   */
  constructor(components, { minScoreThreshold = 0.3 } = {}) {
    super('Composite');
    this.components = components;
    this.minScoreThreshold = minScoreThreshold;
  }

  evaluate(context) {
    const votes = [];
    const details = [];
    let totalWeight = 0;

    for (const { strategy, weight } of this.components) {
      const result = strategy.evaluate(context);
      votes.push({ ...result, weight, name: strategy.name });
      totalWeight += weight;
      details.push(`${strategy.name}: ${result.action} (${(result.confidence * 100).toFixed(0)}%)`);
    }

    // Вычисляем взвешенный скор для BUY и SELL
    let buyScore = 0;
    let sellScore = 0;

    for (const vote of votes) {
      const normalizedWeight = vote.weight / totalWeight;
      if (vote.action === 'BUY') {
        buyScore += vote.confidence * normalizedWeight;
      } else if (vote.action === 'SELL') {
        sellScore += vote.confidence * normalizedWeight;
      }
    }

    const reasoning = details.join('; ');

    if (buyScore > sellScore && buyScore >= this.minScoreThreshold) {
      return {
        action: 'BUY',
        confidence: Math.min(0.95, buyScore),
        reasoning: `Композит -> BUY (score=${buyScore.toFixed(2)}): ${reasoning}`,
      };
    }

    if (sellScore > buyScore && sellScore >= this.minScoreThreshold) {
      return {
        action: 'SELL',
        confidence: Math.min(0.95, sellScore),
        reasoning: `Композит -> SELL (score=${sellScore.toFixed(2)}): ${reasoning}`,
      };
    }

    return {
      action: 'HOLD',
      confidence: 0.5,
      reasoning: `Композит -> HOLD (buy=${buyScore.toFixed(2)}, sell=${sellScore.toFixed(2)}): ${reasoning}`,
    };
  }
}
