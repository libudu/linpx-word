import { uiApi, workerApi } from "..";

// 文本实现
export const globalText = Object.assign(
  async (str: string) => {
    uiApi.showText(str);
    await uiApi.waitUI();
    workerApi.goNext();
  },
  {
    
  }
);