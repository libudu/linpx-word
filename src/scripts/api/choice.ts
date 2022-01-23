import { uiApi, workerApi } from "..";

// 选项实现
export const globalChoice = Object.assign(
  async (choiceList: string[] | string) => {
    await new Promise(resolve => {
      // 字符串则处理成数组
      if(!Array.isArray(choiceList)) {
        choiceList = [choiceList];
      }
      uiApi.showChoice(choiceList, (index) => {
        workerApi.setReturn(index);
        resolve(null);
      });
    });
    workerApi.goNext();
  },
  {
  }
);