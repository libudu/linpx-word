// 【提示】使用英文双括号括起一段话，组成一个“字符串”，可以显示出一段文本
"<text i>斜体</text><text bold>粗体</text><text color=red>red</text>"
"<text color=red i bold>粗斜红</text><text color=#aabbcc>rgb #aabbcc</text>"
"你来到了一片丛林。"
"这里有很多草"
"艹艹艹艹艹艹艹艹艹艹艹艹艹"

// 【提示】调用choice，传入一个字符串，可以唤出一个需要玩家点击的选项
choice("继续")
"艹艹艹艹艹艹艹艹艹艹艹艹艹"
"艹艹艹艹艹艹艹艹艹艹艹艹艹"

// 【提示】传入多个字符串，提供多个熏香
choice("观察", "撤退")

// 【提示】选项结果的结果会存在“变量”_return中
// 【提示】_return表示上一个选项的次序，从0开始
// 【提示】比如如果上一步玩家选择了观察_return就是0，选择了撤退_return就是1
if(_return == 0) {
  "你看到了一个宝箱"
  "你选择："
  choice("打开宝箱", "离开")
  if(_return == 1) {
    leave();
  } else {
    for(let i=0; i < 3; i++) {
      "宝箱打不开"
      choice("继续尝试打开")
    }
    "宝箱打开了，你胜利了！"
    "重新开始"
    core.restart()
  }
} else {
  leave()
}

// 也可以声明函数，用于分割复用代码
function leave() {
  "你离开了"
  choice("重新开始")
  // 提供了一些全局对象，用于控制游戏流程
  core.restart()
}