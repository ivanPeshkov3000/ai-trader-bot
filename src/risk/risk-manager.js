export class RiskManager {
  constructor({ maxPositionSizeRub, maxDailyLossRub }) {
    this.maxPositionSizeRub = maxPositionSizeRub;
    this.maxDailyLossRub = maxDailyLossRub;
    this.realizedPnL = 0;
  }

  validate(signal) {
    if (this.realizedPnL <= -this.maxDailyLossRub) {
      return { accepted: false, reason: 'Достигнут дневной лимит убытка' };
    }

    const orderValue = signal.referencePrice;
    if (orderValue > this.maxPositionSizeRub) {
      return { accepted: false, reason: 'Превышен размер позиции на сделку' };
    }

    return { accepted: true };
  }

  registerExecution(_execution) {
    // Заглушка: сюда можно подключить подсчет realized/unrealized PnL.
  }
}
