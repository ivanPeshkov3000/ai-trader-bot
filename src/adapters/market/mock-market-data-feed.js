import { setInterval, clearInterval } from 'node:timers';

export class MockMarketDataFeed {
  constructor(symbols, intervalMs = 1_000) {
    this.symbols = symbols;
    this.intervalMs = intervalMs;
    this.handlers = [];
    this.intervalId = null;
    this.prices = new Map(symbols.map((s) => [s, 100 + Math.random() * 100]));
  }

  async connect() {
    this.intervalId = setInterval(() => {
      for (const symbol of this.symbols) {
        const oldPrice = this.prices.get(symbol);
        const drift = (Math.random() - 0.5) * 0.8;
        const nextPrice = Math.max(1, oldPrice + drift);
        this.prices.set(symbol, nextPrice);

        const tick = {
          symbol,
          price: Number(nextPrice.toFixed(2)),
          timestamp: new Date().toISOString(),
        };

        for (const handler of this.handlers) {
          handler(tick);
        }
      }
    }, this.intervalMs);
  }

  async disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onTick(handler) {
    this.handlers.push(handler);
  }
}
