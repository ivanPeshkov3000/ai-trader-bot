/**
 * Буфер ценовой истории для каждого символа.
 * Хранит последние `maxLength` цен для расчёта индикаторов.
 */
export class PriceHistory {
  constructor(maxLength = 200) {
    this.maxLength = maxLength;
    this.history = new Map();
  }

  /**
   * Добавить цену по символу.
   */
  push(symbol, price) {
    if (!this.history.has(symbol)) {
      this.history.set(symbol, []);
    }

    const prices = this.history.get(symbol);
    prices.push(price);

    if (prices.length > this.maxLength) {
      prices.shift();
    }
  }

  /**
   * Получить массив цен по символу.
   */
  get(symbol) {
    return this.history.get(symbol) ?? [];
  }

  /**
   * Количество накопленных цен.
   */
  length(symbol) {
    return this.get(symbol).length;
  }
}
