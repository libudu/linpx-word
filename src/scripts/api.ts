// 将接口暴露为全局方法，供脚本使用
import { globalChoice } from './Global/choice';
import { globalText } from './Global/text';

declare global {
  const text: typeof globalText;
  const choice: typeof globalChoice;
  let _return: number;
  let _return_item: string;
}

(window as any).text = globalText;
(window as any).choice = globalChoice;
(window as any)._return = 0;