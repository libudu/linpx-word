import { Hint, HintFunction, on } from 'codemirror';

interface IHint {
  text: string;
  displayText?: string;
  desc: string;
  pickUpMove?: number;
  pickLeftMove?: number;
}

const hintInfoList: IHint[] = [
  // 业务功能
  {
    text: 'text("")',
    displayText: 'text',
    desc: '显示一段文本',
    pickLeftMove: 2,
  },
  {
    text: 'choice("")',
    desc: '显示单选选项',
    pickLeftMove: 2,
  },
  {
    text: 'choice(["", ""])',
    desc: '显示多选选项',
    pickLeftMove: 8,
  },
  {
    text: '_return',
    desc: '上个选项的返回值，0开始',
  },
  // core
  {
    text: 'core.restart()',
    displayText: 'core.restart',
    desc: '让游戏重新开始'
  },
  // js语法
  {
    text: 'const  = ',
    displayText: 'const',
    desc: '声明一个常量',
    pickLeftMove: 3,
  },
  {
    text: 'let  = ',
    displayText: 'let',
    desc: '声明一个变量',
    pickLeftMove: 3,
  },
  {
    text: 'function (){\n}',
    displayText: 'function',
    desc: '声明一个函数',
    pickUpMove: 1,
    pickLeftMove: -8,
  },
  {
    text: 'if(){\n}',
    displayText: 'if()',
    desc: '条件判断语句',
    pickLeftMove: -2,
    pickUpMove: 1,
  }
];

export const hint: HintFunction = (cmInstance) => {
  const cursor = cmInstance.getCursor();
  const token = cmInstance.getTokenAt(cursor);
  
  const str = token.string;
  if(!str) {
    return;
  }

  const checkIsHint = (word: string) => {
    return word.indexOf(str) == 0 && word !== str;
  };

  const hintList: (Hint & { pickLeftMove?: number; pickUpMove?: number })[] = [];
  // 每个看看是否当前以此开头
  hintInfoList.forEach(({ text, displayText, desc, pickLeftMove, pickUpMove }) => {
    if(checkIsHint(text)) {
      // 加入提示
      hintList.push({
        text,
        displayText,
        render: (ele) => {
          ele.style.setProperty('height', '18px');
          ele.style.setProperty('display', 'flex');
          ele.innerHTML = `
            <div class='flex'>
              <div style='width: 200px'>${displayText || text}</div>
              <div>${desc}</div>
            </div>
          `;
        },
        pickLeftMove,
        pickUpMove,
      });
    }
  })
  const result = {
    list: hintList,
    from: {ch: token.start, line: cursor.line},
    to: {ch: token.end, line: cursor.line},
  };
  // 某些选项选中后，光标可能左移几格
  on(result, 'pick', (e: any) => {
    const leftMove = e.pickLeftMove;
    const upMove = e.pickUpMove;
    const cursor = cmInstance.getCursor();
    cmInstance.setCursor({ ch: cursor.ch - (leftMove || 0), line: cursor.line - (upMove || 0) });
  })
  return result;
  
  return undefined;
};