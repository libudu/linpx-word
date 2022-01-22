// 加载脚本全局方法
import './api';

// 初始化脚本代码到全局store
import TestScript from '@/../scripts/test.ts?raw'
import { store } from '@/store';
import scriptTransform from '@/utils/scriptTransform';
store.setScript(TestScript);

interface ScriptCore {
  // 让ui层显示一条信息
  showText: (text: string) => void;
  showChoice: (choiceList: string[], onClick: (index: number) => void) => void;
  // 等待ui层请求继续
  waitUI: () => Promise<void>;
  // 当前运行脚本的文本文件
  runningScript?: string;
  restart: () => void;
}

export let scriptCore: ScriptCore;

// 等待UI的Promise的Resolve函数
let UIPromiseResolve = () => {};

export const loadScript = ({
  script,
  showText,
  showChoice,
  onRestart,
}: {
  script: string;
  showText: ScriptCore['showText'];
  showChoice: ScriptCore['showChoice'];
  onRestart: ScriptCore['restart'];
}) => {
  // 创建core
  scriptCore = {
    showText,
    showChoice,
    waitUI: async () => {
      return new Promise((resolve) => {
        UIPromiseResolve = resolve;
      });
    },
    restart: onRestart,
  }
  // 返回给UI的goNext
  const goNext = () => {
    // 第一次调用，开始运行脚本
    if(!scriptCore.runningScript) {
      // todo: 使用web worker重做脚本引擎
      // 现在用eval很不安全，且无法真正关闭，使用web worker这些都能解决
      const finalScript = scriptTransform(script);
      if(finalScript) {
        eval(finalScript);
        scriptCore.runningScript = script;
      }
    // 之后调用，唤起被UI阻塞的下一句脚本
    } else {
      UIPromiseResolve();
    }
  }
  return {
    goNext
  };
};