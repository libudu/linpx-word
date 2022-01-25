import { IWorkerHandler, IWorkerMessage, WorkerApi } from "./worker";


const postMessage = <T extends keyof IWorkerHandler>(method: T, args: Parameters<IWorkerHandler[T]>) => {
  self.postMessage({
    method,
    args,
  });
};

const main = async () => {
  // 用户接口声明
  let text: WorkerApi['text'];
  let choice: WorkerApi['choice'];
  let core: WorkerApi['core'];
  let _return = 0;

  // 使用闭包初始化用户接口
  await (async function () {
    // 等待游览器goNext消息后再继续执行
    let goNextPromiseResolve: (...args: any) => void;
    const waitGoNext = async () => {
      await new Promise(resolve => {
        goNextPromiseResolve = resolve;
      });
    };

    // 监听游览器消息
    const methodMap: Record<string, (...args: any[]) => void> = {
      // 继续消息
      goNext: () => {
        goNextPromiseResolve();
      },
      // 设置_return消息
      _return: (value: number) => {
        _return = value;
      },
    };
    onmessage = ({ data: { method, args } }: IWorkerMessage) => {
      methodMap[method]?.(args);
    };

    // 调用游览器方法
    const makeWaitParentMethod = (name: string) => {
      return async (...args: any[]) => {
        postMessage(name as any, args);
        await waitGoNext();
      };
    };

    // 实现提供给用户的接口
    text = makeWaitParentMethod('text');
    choice = makeWaitParentMethod('choice');
    core = {
      restart: () => {
        postMessage('restart', []);
        close();
      },
    };
  })();

  // @code
};

(async () => {
  try {
    await main();
  } catch (e: any) {
    postMessage('error', [ e.stack ]);
  }
})();