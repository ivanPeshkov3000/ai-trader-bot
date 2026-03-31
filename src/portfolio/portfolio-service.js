export class PortfolioService {
  constructor(brokerGateway) {
    this.brokerGateway = brokerGateway;
  }

  async snapshot() {
    return this.brokerGateway.getPortfolio();
  }
}
