/**
 * Простейший агент:
 * 1) Если цена упала относительно последней -> BUY
 * 2) Если выросла -> SELL
 * 3) Иначе HOLD
 */
export class RuleAssistedAgent {
  constructor() {
    this.lastPriceBySymbol = new Map();
  }

  async decide(context) {
    const { tick } = context;
    const lastPrice = this.lastPriceBySymbol.get(tick.symbol);
    this.lastPriceBySymbol.set(tick.symbol, tick.price);

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
}
