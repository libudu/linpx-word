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
import { emitEvent, GameEvent, listenEvent } from '@/utils/event';

const CPS = 30;

const Battle: React.FC = () => {
  const [value, setValue] = useState(0);
  const [dialogList, setDialogList] = useState<React.ReactElement[]>([]);
  const ref = useRef(dialogList);
  ref.current = dialogList;

  useEffect(() => {
    let timer: number;
    // 清除游戏
    const clearGame = () => {
      setDialogList([]);
      clearTimeout(timer);
    };
    const startGame = () => {
      const { script, runningMode } = store;
      const getKey = (() => {
        let i = 0;
        return () => i++;
      })();
      loadScript({
        // 文本
        script,
        showText: (text) => {
          setDialogList([
            ...ref.current,
            <Text key={getKey()} text={text} />
          ]);
          // 显示之后延迟500ms动画时间 + 100ms基础时间 + 文字/每秒阅读字数时间
          let delay = 600 + text.length / CPS * 1000;
          if(runningMode == 'dev') {
            delay /= 3;
          }
          timer = setTimeout(() => {
            emitEvent(GameEvent.goNext);
          }, delay);
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
          emitEvent(GameEvent.gameEnd);
          emitEvent(GameEvent.gameStart);
        },
      });
      try {
        emitEvent(GameEvent.goNext);
        // 没有出错，将错误信息置空
        store.setErrorInfo('');
      } catch (e) {
        store.setErrorInfo('代码编写出错！\n' + (e as Error).message);
        clearGame();
      }
    };

    const removeStartListener = listenEvent(GameEvent.gameStart, () => {
      console.log('game start');
      startGame();
    });

    const removeEndListener = listenEvent(GameEvent.gameEnd, () => {
      console.log('game end');
      clearGame();
    });

    return () => {
      clearGame();
      removeStartListener();
      removeEndListener();
    };
  }, []);

  return (
    <div className='flex flex-col w-full h-full relative'>
      <div className="flex items-center my-2 px-4">
        <img className="w-10 mr-4" src={HeroBadgeImg} />
        <ValueBar value={value} borderColor="red" fillColor="orange" />
      </div>
      <div className="flex items-center my-2 px-4">
        <img className="w-10 mr-4" src={LightImg} />
        <ValueBar value={value} borderColor="#4a86e8" fillColor="#26aceb" />
      </div>
      <Divider />
      <div className="text-xl px-4 flex-grow overflow-y-scroll scrollbar-hidden">
        {
          dialogList
        }
      </div>
    </div>
  );
};

export default observer(Battle);