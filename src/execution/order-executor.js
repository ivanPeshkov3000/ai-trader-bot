export class OrderExecutor {
  constructor(brokerGateway) {
    this.brokerGateway = brokerGateway;
  }

  async execute(signal) {
    const quantity = 1;
    return this.brokerGateway.placeOrder({
      symbol: signal.symbol,
      side: signal.side,
      quantity,
      price: signal.referencePrice,
    });
  }
}
