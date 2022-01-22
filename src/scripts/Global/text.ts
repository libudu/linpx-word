import { scriptCore } from "..";

// 文本实现
export const globalText = Object.assign(
  async (str: string) => {
    scriptCore.showText(str);
    await scriptCore.waitUI();
  },
  {
  },
);