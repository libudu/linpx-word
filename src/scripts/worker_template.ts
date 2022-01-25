import { IChoice } from "./event";
import { IWorkerHandler, IWorkerMessage } from "./worker";

const postMessage = <T extends keyof IWorkerHandler>(method: T, ...args: Parameters<IWorkerHandler[T]>) => {
  self.postMessage({
    method,
    args,
  });
};

// 等待游览器goNext消息后再继续执行
let goNextPromiseResolve: (...args: any) => void;
const waitGoNext = async () => {
  await new Promise(resolve => {
    goNextPromiseResolve = resolve;
  });
};

const main = async () => {
  // 用户接口声明
  const text = (content: string) => {
    postMessage('text', { content });
    waitGoNext();
  };
  const choice = (...items: IChoice['items']) => {
    postMessage('choice', { items, animate: 'fade' });
    waitGoNext();
  };
  const choice_show = (...items: IChoice['items']) => {
    postMessage('choice', { items, animate: 'show' });
    waitGoNext();
  };
  const choice_hide = (...items: IChoice['items']) => {
    postMessage('choice', { items, animate: 'hide' });
    waitGoNext();
  };
  const core = {
    restart: () => {
      postMessage('restart');
    },
  }
  let _return = 0;

  // 使用闭包初始化用户接口
  await (async function () {
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