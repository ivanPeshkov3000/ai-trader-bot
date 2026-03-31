export class SignalEngine {
  constructor(agent) {
    this.agent = agent;
  }

  async buildSignal(tick, portfolio) {
    const decision = await this.agent.decide({ tick, portfolio });

    if (decision.action === 'HOLD') {
      return null;
    }

    return {
      symbol: tick.symbol,
      side: decision.action,
      confidence: decision.confidence,
      reasoning: decision.reasoning,
      referencePrice: tick.price,
      timestamp: tick.timestamp,
    };
  }
}
