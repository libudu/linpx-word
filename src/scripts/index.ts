// 初始化脚本代码到全局store
import TestScript from '@/../scripts/test.ts?raw'
import { store } from '@/store';
import scriptTransform from '@/scripts/transform';
import { createWorker } from './worker';
store.setScript(TestScript);

interface UiApi {
  // 让ui层显示一条信息
  showText: (text: string) => void;
  showChoice: (choiceList: string[], onClick: (index: number) => void) => void;
  // 等待ui层请求继续
  waitUI: () => Promise<void>;
  // 让ui层清空重启
  restart: () => void;
}

export let uiApi: UiApi;

interface WorkerApi {
  setReturn: (_return: number) => void;
  goNext: () => void;
  endGame:  () => void;
}

export let workerApi: WorkerApi;

// 等待UI的Promise的Resolve函数
let uiGoNext = () => {};

export const loadScript = ({
  script,
  showText,
  showChoice,
  onRestart,
}: {
  script: string;
  showText: UiApi['showText'];
  showChoice: UiApi['showChoice'];
  onRestart: UiApi['restart'];
}) => {
  // 根据传入参数构建uiApi
  uiApi = {
    showText,
    showChoice,
    waitUI: async () => {
      return new Promise((resolve) => {
        uiGoNext = resolve;
      });
    },
    restart: onRestart,
  }
  // 开始游戏，创建worker并构建worker api
  const startGame = () => {
    const finalScript = scriptTransform(script);
    if(finalScript) {
      const w = createWorker(finalScript);
      workerApi = {
        setReturn: (_return) => {
          w.postMessage({
            method: '_return',
            args: _return,
          });
        },
        goNext: () => {
          w.postMessage({
            method: 'goNext',
          });
        },
        endGame: () => {
          console.log('worker shut down!');
          w.terminate();
        },
      };
    }
  };
  // 返回给UI层的api
  return {
    goNext: () => {
      if(!workerApi) {
        startGame();
      } else {
        uiGoNext();
      }
    },
    endGame: () => {
      workerApi?.endGame();
      workerApi = undefined as any;
    }
  };
};