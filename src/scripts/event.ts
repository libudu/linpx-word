import { EventEmitter2 } from "eventemitter2";

const emitter = new EventEmitter2();

// 核心生命周期事件
enum GameLifeEvent {
  gameStart = 'gameStart',
  goNext = 'goNext',
  error = 'error',
  gameEnd = 'gameEnd',
  restart = 'restart',
}

// 主要功能事件
enum GameCoreEvent {
  text = 'text',
  choice = 'choice',
  choiceReturn = 'choiceReturn',
}

const makeEventHandler = <T>(symbol: string) => {
  return {
    on: (callback: (arg: T) => void) => {
      emitter.on(symbol, callback);
      return () => void emitter.off(symbol, callback);
    },
    once: (callback: (arg: T) => void) => {
      emitter.once(symbol, callback);
    },
    emit: (arg: T) => {
      emitter.emit(symbol, arg);
    },
  }
};

export interface IText {
  content: string;
}

export interface IChoice {
  items: string[] | string;
}

export const textEvent = makeEventHandler<IText>(GameCoreEvent.text);
export const choiceEvent = makeEventHandler<IChoice>(GameCoreEvent.choice);
export const choiceReturnEvent = makeEventHandler<number>(GameCoreEvent.choiceReturn);
export const lifeEvent = {
  start: makeEventHandler<void>(GameLifeEvent.gameStart),
  end: makeEventHandler<void>(GameLifeEvent.gameEnd),
  goNext: makeEventHandler<void>(GameLifeEvent.goNext),
  error: makeEventHandler<any>(GameLifeEvent.error),
  restart: makeEventHandler<void>(GameLifeEvent.restart),
}