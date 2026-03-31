import { Events } from '../core/types.js';

export class TradingEngine {
  constructor({ eventBus, marketDataFeed, portfolioService, signalEngine, riskManager, orderExecutor, logger }) {
    this.eventBus = eventBus;
    this.marketDataFeed = marketDataFeed;
    this.portfolioService = portfolioService;
    this.signalEngine = signalEngine;
    this.riskManager = riskManager;
    this.orderExecutor = orderExecutor;
    this.logger = logger;
  }

  async start() {
    this.marketDataFeed.onTick(async (tick) => {
      this.eventBus.publish(Events.MARKET_TICK, tick);

      const portfolio = await this.portfolioService.snapshot();
      const signal = await this.signalEngine.buildSignal(tick, portfolio);
      if (!signal) return;

      this.eventBus.publish(Events.SIGNAL_CREATED, signal);

      const riskCheck = this.riskManager.validate(signal);
      if (!riskCheck.accepted) {
        this.eventBus.publish(Events.RISK_REJECTED, { signal, reason: riskCheck.reason });
        return;
      }

      this.eventBus.publish(Events.ORDER_REQUESTED, signal);
      const execution = await this.orderExecutor.execute(signal);
      this.riskManager.registerExecution(execution);
      this.eventBus.publish(Events.ORDER_EXECUTED, execution);
    });

    await this.marketDataFeed.connect();
    this.logger.info('Trading engine started');
  }

  async stop() {
    await this.marketDataFeed.disconnect();
    this.logger.info('Trading engine stopped');
  }
}
