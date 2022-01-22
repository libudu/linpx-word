(async () => {
  // 避免将第一句字符串字面量视为函数指令
  true; // 字符串显示一段文本

  await text("\u4F60\u6765\u5230\u4E86\u4E00\u7247\u4E1B\u6797\u3002"); // choice函数显示一个选项
  // 传入各选项字符串的列表

  await choice(["观察", "撤退"]); // 选项结果的序号将存储在_return变量中，从0开始
  // 也可以用正常javascript的流程控制

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