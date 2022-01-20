import { scriptCore } from "..";

// 呈现一段文本
export const globalText = Object.assign(
  // 将text作为函数调用
  async (str: string) => {
    scriptCore.showText(str);
    await scriptCore.waitUI();
  },
  // 使用text上挂载的方法
  {
    color: "red",
  },
);