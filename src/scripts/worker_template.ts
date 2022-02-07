import { IChoice, IText } from "./event";
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
  const _text = (props: IText) => {
    postMessage('text', props);
    waitGoNext();
  };

  // 使得text可以链式调用
  const makeChainText = (props: Partial<IText> = {}) => {
    return Object.assign((content: string) => {
      _text({ ...props, content });
    }, {
      // todo：调用text对象上的方法，调颜色、大小、特效等
      color: (color: string) => {
        const newProps = { ...props };
        if(!newProps.style) newProps.style = {};
        newProps.style['color'] = color;
        return makeChainText(newProps);
      },
      size: () => {},
    });
  };

  const text = makeChainText();
  const say = (name: string, content: string) => postMessage('text', { content, name });

  // 选项
  const _choice = (props: IChoice) => {
    postMessage('choice', props);
    waitGoNext();
  };
  const choice = (...items: IChoice['items']) => _choice({ items, animate: 'fade' });
  const choice_show = (...items: IChoice['items']) => _choice({ items, animate: 'show' });
  const choice_hide = (...items: IChoice['items']) => _choice({ items, animate: 'hide' });
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