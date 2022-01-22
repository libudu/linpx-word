(async () => {
  // 避免将第一句字符串字面量视为函数指令
  true;
  await text("\u4F60\u6765\u5230\u4E86\u4E00\u7247\u4E1B\u6797\u3002");
  await choice(["观察", "撤退"]);

  if (_return == 0) {
    await text("\u4F60\u770B\u5230\u4E86\u4E00\u4E2A\u5B9D\u7BB1");
  } else {
    await text("\u4F60\u79BB\u5F00\u4E86");
  }
})();