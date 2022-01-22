// 字符串显示一段文本
"你来到了一片丛林。"

// choice函数显示一个选项
// 传入各选项字符串的列表
choice([
  "观察",
  "撤退",
])

// 选项结果的序号将存储在_return变量中，从0开始
// 也可以用正常javascript的流程控制
if(_return == 0) {
  "你看到了一个宝箱"
  "你选择："
  choice(["打开宝箱", "离开"])
  if(_return == 1) {
    leave();
  } else {
    for(let i=0; i < 3; i++) {
      "宝箱打不开"
      choice(["继续尝试打开"])
    }
    "宝箱打开了，你胜利了！"
    core.restart()
  }
} else {
  leave()
}

// 也可以声明函数，用于分割复用代码
function leave() {
  "你离开了"
  choice(["重新开始"])
  // 提供了一些全局对象，用于控制游戏流程
  core.restart()
}