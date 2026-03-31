/**
 * Базовый интерфейс брокера.
 * В реальном контуре здесь должен быть адаптер к API выбранного брокера.
 */
export class BrokerGateway {
  async placeOrder(_orderRequest) {
    throw new Error('placeOrder() is not implemented');
  }

  async getPortfolio() {
    throw new Error('getPortfolio() is not implemented');
  }
}
