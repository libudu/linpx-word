import { scriptCore } from "..";

// 一段文本
export const globalText = Object.assign(
  // 作为函数调用
  async (str: string) => {
    scriptCore.showText(str);
    await scriptCore.waitUI();
  },
  // 对象上挂载方法
  {
  },
);