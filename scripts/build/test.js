(async () => {
  // 避免将第一句字符串字面量视为函数指令
  true;
  await text("\u4F60\u6765\u5230\u4E86\u4E00\u7247\u4E1B\u6797\u3002");
  await choice(["观察", "撤退"]);

  async function leave() {
    "你离开了";

    await choice(["重新开始"]);
    await core.restart();
  }

  if (_return == 0) {
    await text("\u4F60\u770B\u5230\u4E86\u4E00\u4E2A\u5B9D\u7BB1");
    await text("\u4F60\u9009\u62E9\uFF1A");
    await choice(["打开宝箱", "离开"]);

    if (_return == 1) {
      await leave();
    } else {
      await text("\u5B9D\u7BB1\u6253\u4E0D\u5F00");
    }
  } else {
    await leave();
  }
})();