import { EventEmitter } from 'node:events';

export class EventBus extends EventEmitter {
  publish(eventName, payload) {
    this.emit(eventName, payload);
  }

  subscribe(eventName, handler) {
    this.on(eventName, handler);
    return () => this.off(eventName, handler);
  }
}
