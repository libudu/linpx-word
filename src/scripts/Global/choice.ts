import { scriptCore } from "..";

// 选项实现
export const globalChoice = Object.assign(
  async (choiceList: string[]) => {
    const promise = new Promise(resolve => {
      scriptCore.showChoice(choiceList, (index) => {
        resolve(null);
        _return = index;
      });
    });
    await promise;
  }
);