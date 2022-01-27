import { choiceEvent, lifeEvent, textEvent } from "./event";

// 收到worker发来的调用用户脚本api后的处理
// 影响到worker_template中postMessage参数
export const workerMessageHandler = {
  text: textEvent.emit,
  choice: choiceEvent.emit,
  restart: lifeEvent.restart.emit,
  error: lifeEvent.error.emit,
};

export type IWorkerHandler = typeof workerMessageHandler;

// worker交互统一的数据格式
export interface IWorkerMessageData {
  method: string;
  args?: any[];
}

export interface IWorkerMessage {
  data: {
    method: string;
    args?: any[];
  }
}

export const createWorker = (script: string) => {
  const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const worker = new Worker(url);
  console.log('worker start on', url);

  // 收到worker消息
  worker.onmessage = ({ data: { method, args } }: IWorkerMessage) => {
    // @ts-ignore
    workerMessageHandler[method]?.(...args);
  };

  return worker;
};

