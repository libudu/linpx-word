import TestScript from '@/../scripts/build/test?raw';
import './api';

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
  showText,
  showChoice,
  onRestart,
}: {
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
      eval(TestScript);
      scriptCore.runningScript = TestScript;
    // 之后调用，唤起被UI阻塞的下一句脚本
    } else {
      UIPromiseResolve();
    }
  }
  return {
    goNext,
  };
};