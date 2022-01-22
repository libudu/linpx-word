(async () => {
  // 避免将第一句字符串字面量视为函数指令
  true; // 【提示】使用英文双括号括起一段话，组成一个“字符串”，可以显示出一段文本

  await text("\u4F60\u6765\u5230\u4E86\u4E00\u7247\u4E1B\u6797\u3002");
  await text("\u8FD9\u91CC\u6709\u5F88\u591A\u8349");
  await text("\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279"); // 【提示】调用choice，传入一个字符串，可以唤出一个需要玩家点击的选项

  await choice("继续走");
  await text("\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279");
  await text("\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279\u8279"); // 【提示】使用中括号括起多个字符串，组成“列表”
  // 【提示】将字符串列表传入choice，可以唤出多选选项

  await choice(["观察", "撤退"]); // 【提示】选项结果的结果会存在“变量”_return中
  // 【提示】_return表示上一个选项的次序，从0开始
  // 【提示】比如如果上一步玩家选择了观察_return就是0，选择了撤退_return就是1

  if (_return == 0) {
    await text("\u4F60\u770B\u5230\u4E86\u4E00\u4E2A\u5B9D\u7BB1");
    await text("\u4F60\u9009\u62E9\uFF1A");
    await choice(["打开宝箱", "离开"]);

    if (_return == 1) {
      await leave();
    } else {
      for (let i = 0; i < 3; i++) {
        await text("\u5B9D\u7BB1\u6253\u4E0D\u5F00");
        await choice(["继续尝试打开"]);
      }

      await text("\u5B9D\u7BB1\u6253\u5F00\u4E86\uFF0C\u4F60\u80DC\u5229\u4E86\uFF01");
      await text("\u91CD\u65B0\u5F00\u59CB");
      await core.restart();
    }
  } else {
    await leave();
  } // 也可以声明函数，用于分割复用代码


  async function leave() {
    "你离开了";

    await choice(["重新开始"]); // 提供了一些全局对象，用于控制游戏流程

    await core.restart();
  }
})();