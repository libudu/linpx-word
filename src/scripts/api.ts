// 将接口暴露为全局方法，供脚本使用
import { globalChoice } from './Global/choice';
import { globalCore } from './Global/core';
import { globalText } from './Global/text';

declare global {
  const text: typeof globalText;
  const choice: typeof globalChoice;
  let _return: any;
  const core: typeof globalCore;
}

(window as any).text = globalText;
(window as any).choice = globalChoice;
(window as any)._return = 0;
(window as any).core = globalCore;