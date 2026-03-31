/**
 * Интерфейс market data feed.
 * В проде сюда можно подключить real-time данные через WebSocket от биржи/брокера.
 */
export class MarketDataFeed {
  async connect() {
    throw new Error('connect() is not implemented');
  }

  async disconnect() {
    throw new Error('disconnect() is not implemented');
  }

  onTick(_handler) {
    throw new Error('onTick() is not implemented');
  }
}
