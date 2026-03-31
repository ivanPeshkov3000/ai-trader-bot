export class PaperBrokerGateway {
  constructor() {
    this.cashRub = 1_000_000;
    this.positions = new Map();
  }

  async placeOrder(orderRequest) {
    const { symbol, side, quantity, price } = orderRequest;
    const gross = quantity * price;

    if (side === 'BUY') {
      this.cashRub -= gross;
      this.positions.set(symbol, (this.positions.get(symbol) ?? 0) + quantity);
    } else {
      this.cashRub += gross;
      this.positions.set(symbol, (this.positions.get(symbol) ?? 0) - quantity);
    }

    return {
      status: 'FILLED',
      symbol,
      side,
      quantity,
      price,
      executedAt: new Date().toISOString(),
    };
  }

  async getPortfolio() {
    return {
      cashRub: Number(this.cashRub.toFixed(2)),
      positions: Object.fromEntries(this.positions.entries()),
    };
  }
}
