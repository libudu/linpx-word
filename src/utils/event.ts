import { EventEmitter2 } from "eventemitter2";

const emitter = new EventEmitter2();

export const gameStart = () => {
  emitter.emit('gameStart');
};

export const gameEnd = () => {
  emitter.emit('gameEnd');
}

export const listenGameStart = (callback: () => void) => {
  emitter.on('gameStart', callback);
  return () => emitter.off('gameStart', callback);
};

export const listenGameEnd = (callback: () => void) => {
  emitter.on('gameEnd', callback);
  return () => emitter.off('gameEnd', callback);
};