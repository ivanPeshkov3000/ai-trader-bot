import { PriceHistory } from './price-history.js';

/**
 * Движок генерации сигналов.
 *
 * Объединяет стратегию (техн. анализ) и AI-агента.
 * - Стратегия анализирует ценовую историю через индикаторы.
 * - AI-агент может подтвердить, отклонить или дополнить решение.
 * - Если стратегия не задана, работает только через агента (обратная совместимость).
 */
export class SignalEngine {
  /**
   * @param {object} agent — AI-агент с методом decide()
   * @param {{ strategy?: object, priceHistoryLength?: number }} options
   */
  constructor(agent, { strategy = null, priceHistoryLength = 200 } = {}) {
    this.agent = agent;
    this.strategy = strategy;
    this.priceHistory = new PriceHistory(priceHistoryLength);
  }

  async buildSignal(tick, portfolio) {
    this.priceHistory.push(tick.symbol, tick.price);

    let decision;

    if (this.strategy) {
      const prices = this.priceHistory.get(tick.symbol);
      const strategyResult = this.strategy.evaluate({ prices, tick, portfolio });

      // Передаём результат стратегии агенту как дополнительный контекст
      decision = await this.agent.decide({
        tick,
        portfolio,
        strategySignal: strategyResult,
      });
    } else {
      // Обратная совместимость: только агент
      decision = await this.agent.decide({ tick, portfolio });
    }

    if (decision.action === 'HOLD') {
      return null;
    }

    return {
      symbol: tick.symbol,
      side: decision.action,
      confidence: decision.confidence,
      reasoning: decision.reasoning,
      referencePrice: tick.price,
      timestamp: tick.timestamp,
    };
  }
}
