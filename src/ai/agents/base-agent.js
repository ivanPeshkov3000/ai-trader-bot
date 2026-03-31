/**
 * Интерфейс AI-агента.
 * Можно реализовать адаптер к OpenAI, локальной LLM или агентной системе.
 */
export class BaseAgent {
  async decide(_context) {
    throw new Error('decide() is not implemented');
  }
}
