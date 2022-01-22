import { scriptCore } from "..";

// 选项实现
export const globalChoice = Object.assign(
  async (choiceList: string[] | string) => {
    const promise = new Promise(resolve => {
      // 字符串则处理成数组
      if(!Array.isArray(choiceList)) {
        choiceList = [choiceList];
      }
      scriptCore.showChoice(choiceList, (index) => {
        resolve(null);
        _return = index;
      });
    });
    await promise;
  }
);