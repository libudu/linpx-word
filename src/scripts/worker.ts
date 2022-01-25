import { store } from "@/store";
import { globalChoice } from "./api/choice";
import { globalCore } from "./api/core";
import { globalText } from "./api/text";

// 定义用户脚本中api的格式
// 影响到work_template中哪些接口需要实现
export interface WorkerApi {
  text: typeof globalText;
  choice: typeof globalChoice;
  core: typeof globalCore;
}

// 收到worker发来的调用用户脚本api后的处理
// 影响到worker_template中postMessage参数
export const workerMessageHandler = {
  text: globalText,
  choice: globalChoice,
  restart: globalCore.restart,
  error: (e: string) => {
    store.setErrorInfo('代码执行出错！\n' + e);
  },
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
  const blob = new Blob([script]);
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

