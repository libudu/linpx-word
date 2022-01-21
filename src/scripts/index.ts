import TestScript from '@/static/scripts_build/test.js?raw';
import './api';

interface ScriptCore {
  // 让ui层显示一条信息
  showText: (text: string) => void;
  // 等待ui层请求继续
  waitUI: () => Promise<void>;
  // 当前运行脚本的文本文件
  runningScript?: string;
}

export let scriptCore: ScriptCore;

// 等待UI的Promise的Resolve函数
let UIPromiseResolve = () => {};

export const loadScript = ({
  showText,
}: {
  showText: ScriptCore['showText'];
}) => {
  // 创建core
  scriptCore = {
    showText,
    waitUI: async () => {
      return new Promise((resolve) => {
        UIPromiseResolve = resolve;
      });
    },
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