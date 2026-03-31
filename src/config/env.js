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
};
