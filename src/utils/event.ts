import { EventEmitter2 } from "eventemitter2";

const emitter = new EventEmitter2();

export enum GameEvent {
  gameStart = 'gameStart',
  gameEnd = 'gameEnd',
  goNext = 'goNext',
}

export const emitEvent = (e: GameEvent) => {
  emitter.emit(e);
};

export const listenEvent = (e: GameEvent, callback: () => void) => {
  emitter.on(e, callback);
  return () => emitter.off(e, callback);
};

export const listenEventOnce = (e: GameEvent, callback: () => void) => {
  emitter.once(e, callback);
};