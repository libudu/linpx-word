import TestScript from '@/static/scripts_build/test.js?raw';
import './api';

interface ScriptCore {
  // 让ui层显示一条信息
  showText: (text: string) => void;
  // 等待ui层请求继续
  waitUI: () => Promise<void>;
}

export let scriptCore: ScriptCore;


// 等待UI的Promise的Resolve函数
let waitUIResolve = () => {};

export const loadScript = ({
  showText,
}: {
  showText: ScriptCore['showText'];
}) => {
  scriptCore = {
    showText,
    waitUI: async () => {
      return new Promise((resolve) => {
        waitUIResolve = resolve;
      });
    },
  }
  // 加载脚本
  eval(TestScript);
  return {
    goNext: () => {
      waitUIResolve();
    },
  };
};