// @ts-nocheck
import { sleep } from "./utils";
import { EventEmitter2 } from 'eventemitter2';

export const emitter = new EventEmitter2({ newListener: true });

export enum SIGNAL {
  TEXT = 'text',
  TEXT_APPEND = 'text_append',
}

// 全局类型，用于脚本类型提示
declare global {
  function p(time: number): FakeNode;
  function c(): FakeNode;
  function say(text: string): FakeNode;
  function append(text: string): FakeNode;
}

// 全局变量实现与注入
class Node {
  name: string = ""

  async p(time: number) {
    await sleep(time * 1000);
    return this;
  }

  async c() {
    return this;
  }

  async say(text: string) {
    emitter.emit(SIGNAL.TEXT, text);
    return this;
  }

  async append(text: string) {
    emitter.emit(SIGNAL.TEXT_APPEND, text);
    return this;
  }
}

const narrator = new Node();

window.p = narrator.p;
window.c = narrator.c;
window.say = narrator.say;
window.append = narrator.append;