import React, { useState, useEffect, useRef } from 'react';
import ValueBar from '@/components/ValueBar';
import Divider from '@/components/Divider';
import Text from '@/components/Text';

import LightImg from '@/static/icons/light.svg';
import HeroBadgeImg from '@/static/icons/hero_badge.svg';

import { loadScript } from '@/scripts';
import Choice from '@/components/Choice';
import { observer } from 'mobx-react';
import { store } from '@/store';

const CPS = 30;

const Battle: React.FC = () => {
  const { running, script } = store;
  const [value, setValue] = useState(0);
  const [dialogList, setDialogList] = useState<React.ReactElement[]>([]);
  const ref = useRef(dialogList);
  ref.current = dialogList;

  useEffect(() => {
    // 初始化或停止运行
    if(!running) {
      setDialogList([]);
      return;
    }
    // 开始运行
    let i = 0;
    const getKey = () => {
      return i++;
    }
    let timer: number;
    // 清除游戏
    const clearGame = () => {
      setDialogList([]);
      clearTimeout(timer);
    };
    const startGame = () => {
      const { goNext } = loadScript({
        // 文本
        script,
        showText: (text) => {
          setDialogList([...ref.current, <Text key={getKey()} text={text} />]);
          // 显示之后延迟500ms动画时间 + 100ms基础时间 + 文字/每秒阅读字数时间
          timer = setTimeout(() => {
            goNext();
          }, 600 + text.length / CPS * 1000);
        },
        // 选项
        showChoice: (choiceList, onClick) => {
          setDialogList([
            ...ref.current,
            <Choice
              key={getKey()}
              choiceList={choiceList}
              onClick={onClick}
            />
          ]);
        },
        // 重启
        onRestart: () => {
          clearGame();
          startGame();
        },
      });
      try {
        goNext();
        // 没有出错，将错误信息置空
        store.setErrorInfo('');
      } catch (e) {
        store.setErrorInfo('代码出错了！\n' + (e as Error).message);
        clearGame();
      }
    };
    startGame();
    return () => {
      clearGame();
    };
  }, [running]);

  return (
    <>
      <div className="flex items-center my-2 px-4">
        <img className="w-10 mr-4" src={HeroBadgeImg} />
        <ValueBar value={value} borderColor="red" fillColor="orange" />
      </div>
      <div className="flex items-center my-2 px-4">
        <img className="w-10 mr-4" src={LightImg} />
        <ValueBar value={value} borderColor="#4a86e8" fillColor="#26aceb" />
      </div>
      <Divider />
      <div className="text-xl px-4">
        {
          dialogList
        }
      </div>
    </>
  );
};

export default observer(Battle);