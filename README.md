# AI Trader Bot (Node.js / JavaScript)

Каркас торгового бота для российского фондового рынка с аккуратной интеграцией AI-агентов и возможностью масштабирования.

## Что уже есть

- Событийная архитектура (`EventBus`) для слабой связанности модулей.
- Разделение на слои:
  - `adapters/*` — интеграции с внешним миром (брокер, маркет-данные),
  - `ai/*` — AI-агенты и логика принятия решений,
  - `strategy/*` — сборка торговых сигналов,
  - `risk/*` — риск-менеджмент,
  - `execution/*` — исполнение ордеров,
  - `app/*` — orchestration/use-case слой.
- Paper-trading шлюз (`PaperBrokerGateway`) для безопасной обкатки.
- Mock market feed (`MockMarketDataFeed`) для локальных тестов без доступа к брокеру.

## Быстрый старт

```bash
cp .env.example .env
npm install
npm start
```

## Структура

```text
src/
  app/
    trading-engine.js
  adapters/
    broker/
      broker-gateway.js
      paper-broker-gateway.js
    market/
      market-data-feed.js
      mock-market-data-feed.js
  ai/
    agents/
      base-agent.js
      rule-assisted-agent.js
  config/
    env.js
  core/
    event-bus.js
    types.js
  execution/
    order-executor.js
  portfolio/
    portfolio-service.js
  risk/
    risk-manager.js
  strategy/
    signal-engine.js
  shared/
    logger.js
  index.js
```

## Как масштабировать дальше

1. **Подключить реального брокера**
   - Реализовать класс `TinkoffBrokerGateway` (или другой) с тем же контрактом, что у `BrokerGateway`.
   - Добавить переключение адаптеров через `BOT_MODE`.

2. **Подключить реальные данные рынка**
   - Реализовать `LiveMarketDataFeed` (WebSocket/stream API).
   - Нормализовать входящие тики в единый формат (`symbol`, `price`, `timestamp`).

3. **Добавить LLM/AI-агента**
   - Создать агент, реализующий метод `decide(context)`.
   - В `context` добавлять: индикаторы, стакан, новости, макро-факторы.
   - Вынести prompt/policy в отдельный модуль версионирования.

4. **Сделать multi-agent контур**
   - Agent A: генерация гипотез (направление).
   - Agent B: риск-ревью (проверка лимитов/качества сигнала).
   - Agent C: execution-оптимизация (тайминг, частичное исполнение).

5. **Продакшн готовность**
   - Добавить persistent storage (PostgreSQL/Redis/Kafka).
   - Метрики и алерты (Prometheus + Grafana).
   - Replay/backtest движок на исторических свечах и тиках.
   - CI/CD + контейнеризация + секреты.

## Важно

Это инфраструктурный каркас, а не готовая торговая стратегия. Перед реальной торговлей необходимы:

- юридическая проверка ограничений,
- тщательный бэктест,
- paper-forward тест,
- консервативные риск-лимиты.
