import 'dotenv/config';

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  mode: process.env.BOT_MODE ?? 'paper',
  accountId: process.env.BROKER_ACCOUNT_ID ?? 'demo-account',
  maxPositionSizeRub: toNumber(process.env.MAX_POSITION_SIZE_RUB, 100_000),
  maxDailyLossRub: toNumber(process.env.MAX_DAILY_LOSS_RUB, 10_000),
  symbols: (process.env.SYMBOLS ?? 'SBER,GAZP,LKOH')
    .split(',')
    .map((symbol) => symbol.trim())
    .filter(Boolean),

  // Параметры стратегии
  strategy: {
    smaFastPeriod: toNumber(process.env.SMA_FAST_PERIOD, 10),
    smaSlowPeriod: toNumber(process.env.SMA_SLOW_PERIOD, 30),
    rsiPeriod: toNumber(process.env.RSI_PERIOD, 14),
    rsiOverbought: toNumber(process.env.RSI_OVERBOUGHT, 70),
    rsiOversold: toNumber(process.env.RSI_OVERSOLD, 30),
    macdFast: toNumber(process.env.MACD_FAST, 12),
    macdSlow: toNumber(process.env.MACD_SLOW, 26),
    macdSignal: toNumber(process.env.MACD_SIGNAL, 9),
    minScoreThreshold: toNumber(process.env.STRATEGY_MIN_SCORE, 0.3),
    priceHistoryLength: toNumber(process.env.PRICE_HISTORY_LENGTH, 200),
  },
};
