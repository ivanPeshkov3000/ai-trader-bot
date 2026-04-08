/**
 * Агент с поддержкой стратегий:
 *
 * 1) Если передан strategySignal от движка стратегий — использует его
 *    как основной источник решения, дополняя собственной оценкой.
 * 2) Иначе — фоллбэк на простую логику (сравнение с предыдущей ценой).
 */
export class RuleAssistedAgent {
  constructor() {
    this.lastPriceBySymbol = new Map();
  }

  async decide(context) {
    const { tick, strategySignal } = context;
    const lastPrice = this.lastPriceBySymbol.get(tick.symbol);
    this.lastPriceBySymbol.set(tick.symbol, tick.price);

    // Если стратегия дала сигнал — используем его
    if (strategySignal && strategySignal.action !== 'HOLD') {
      return this._confirmWithPriceAction(strategySignal, tick, lastPrice);
    }

    // Фоллбэк: простая логика на основе изменения цены
    if (lastPrice == null) {
      return { action: 'HOLD', confidence: 0.5, reasoning: 'Недостаточно данных' };
    }

    if (tick.price < lastPrice) {
      return { action: 'BUY', confidence: 0.62, reasoning: 'Локальная просадка' };
    }

    if (tick.price > lastPrice) {
      return { action: 'SELL', confidence: 0.58, reasoning: 'Локальный рост' };
    }

    return { action: 'HOLD', confidence: 0.5, reasoning: 'Цена без изменений' };
  }

  /**
   * Подтверждение сигнала стратегии ценовым действием.
   * Если цена двигается в направлении стратегии — повышаем confidence.
   */
  _confirmWithPriceAction(strategySignal, tick, lastPrice) {
    if (lastPrice == null) {
      return strategySignal;
    }

    const priceChange = tick.price - lastPrice;
    const confirmedByPrice =
      (strategySignal.action === 'BUY' && priceChange < 0) ||
      (strategySignal.action === 'SELL' && priceChange > 0);

    const boost = confirmedByPrice ? 0.05 : -0.05;
    const confidence = Math.max(0.1, Math.min(0.95, strategySignal.confidence + boost));

    const confirmation = confirmedByPrice ? 'подтверждён ценой' : 'не подтверждён ценой';

    return {
      action: strategySignal.action,
      confidence,
      reasoning: `${strategySignal.reasoning} [${confirmation}]`,
    };
  }
}
