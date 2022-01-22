"你来到了一片丛林。"
choice([
  "观察",
  "撤退",
])
function leave() {
  "你离开了"
  choice(["重新开始"])
  core.restart();
}
if(_return == 0) {
  "你看到了一个宝箱"
  "你选择："
  choice(["打开宝箱", "离开"])
  if(_return == 1) {
    leave();
  } else {
    "宝箱打不开"
  }
} else {
  leave();
}