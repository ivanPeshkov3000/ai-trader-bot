/**
 * Базовый интерфейс торговой стратегии.
 *
 * Каждая стратегия получает массив цен и текущий тик,
 * а возвращает объект решения: { action, confidence, reasoning }.
 *
 * action: 'BUY' | 'SELL' | 'HOLD'
 * confidence: число от 0 до 1
 * reasoning: строка с обоснованием
 */
export class BaseStrategy {
  constructor(name) {
    this.name = name;
  }

  /**
   * @param {{ prices: number[], tick: object, portfolio: object }} context
   * @returns {{ action: string, confidence: number, reasoning: string }}
   */
  evaluate(_context) {
    throw new Error(`${this.name}: evaluate() is not implemented`);
  }
}
