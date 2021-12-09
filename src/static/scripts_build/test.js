(async () => {
  await (await say('你好')).p(1);
  await (await say('哈哈')).p(2);
})();