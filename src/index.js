import { env } from './config/env.js';
import { logger } from './shared/logger.js';
import { EventBus } from './core/event-bus.js';
import { Events } from './core/types.js';
import { MockMarketDataFeed } from './adapters/market/mock-market-data-feed.js';
import { PaperBrokerGateway } from './adapters/broker/paper-broker-gateway.js';
import { RuleAssistedAgent } from './ai/agents/rule-assisted-agent.js';
import { SignalEngine } from './strategy/signal-engine.js';
import { SmaCrossoverStrategy } from './strategy/strategies/sma-crossover.js';
import { RsiReversalStrategy } from './strategy/strategies/rsi-reversal.js';
import { MacdTrendStrategy } from './strategy/strategies/macd-trend.js';
import { CompositeStrategy } from './strategy/strategies/composite-strategy.js';
import { RiskManager } from './risk/risk-manager.js';
import { PortfolioService } from './portfolio/portfolio-service.js';
import { OrderExecutor } from './execution/order-executor.js';
import { TradingEngine } from './app/trading-engine.js';

async function main() {
  const eventBus = new EventBus();
  const marketDataFeed = new MockMarketDataFeed(env.symbols);
  const brokerGateway = new PaperBrokerGateway();
  const aiAgent = new RuleAssistedAgent();

  const { strategy: cfg } = env;

  const compositeStrategy = new CompositeStrategy(
    [
      { strategy: new SmaCrossoverStrategy({ fastPeriod: cfg.smaFastPeriod, slowPeriod: cfg.smaSlowPeriod }), weight: 1 },
      { strategy: new RsiReversalStrategy({ period: cfg.rsiPeriod, overboughtLevel: cfg.rsiOverbought, oversoldLevel: cfg.rsiOversold }), weight: 1 },
      { strategy: new MacdTrendStrategy({ fastPeriod: cfg.macdFast, slowPeriod: cfg.macdSlow, signalPeriod: cfg.macdSignal }), weight: 1 },
    ],
    { minScoreThreshold: cfg.minScoreThreshold },
  );

  const signalEngine = new SignalEngine(aiAgent, {
    strategy: compositeStrategy,
    priceHistoryLength: cfg.priceHistoryLength,
  });
  const riskManager = new RiskManager({
    maxPositionSizeRub: env.maxPositionSizeRub,
    maxDailyLossRub: env.maxDailyLossRub,
  });
  const portfolioService = new PortfolioService(brokerGateway);
  const orderExecutor = new OrderExecutor(brokerGateway);

  const tradingEngine = new TradingEngine({
    eventBus,
    marketDataFeed,
    portfolioService,
    signalEngine,
    riskManager,
    orderExecutor,
    logger,
  });

  eventBus.subscribe(Events.MARKET_TICK, (tick) => logger.debug({ tick }, 'Tick received'));
  eventBus.subscribe(Events.SIGNAL_CREATED, (signal) => logger.info({ signal }, 'Signal created'));
  eventBus.subscribe(Events.RISK_REJECTED, ({ reason, signal }) =>
    logger.warn({ reason, signal }, 'Signal rejected by risk manager'),
  );
  eventBus.subscribe(Events.ORDER_EXECUTED, (execution) => logger.info({ execution }, 'Order executed'));

  await tradingEngine.start();

  const stopSignals = ['SIGINT', 'SIGTERM'];
  for (const sig of stopSignals) {
    process.on(sig, async () => {
      logger.info({ sig }, 'Shutdown signal received');
      await tradingEngine.stop();
      process.exit(0);
    });
  }
}

main().catch((error) => {
  logger.error({ err: error }, 'Fatal error');
  process.exit(1);
});
