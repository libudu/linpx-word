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
import { choiceEvent, choiceReturnEvent, IChoice, lifeEvent, textEvent } from '@/scripts/event';
import { IText } from '@/scripts/event';

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
      const { runningMode } = store;
      const getKey = (() => {
        let i = 0;
        return () => i++;
      })();

      const showText = ({ content }: IText) => {
        setDialogList([
          ...ref.current,
          <Text key={getKey()} text={content} />
        ]);
        // 显示之后延迟500ms动画时间 + 100ms基础时间 + 文字/每秒阅读字数时间
        let delay = 600 + content.length / CPS * 1000;
        if(runningMode == 'dev') {
          delay /= 3;
        }
        timer = setTimeout(() => {
          lifeEvent.goNext.emit();
        }, delay);
      };

      const showChoice = ({ items }: IChoice) => {
        if(!Array.isArray(items)) {
          items = [items]
        }
        setDialogList([
          ...ref.current,
          <Choice
            key={getKey()}
            choiceList={items}
            // 点击后触发choiceReturn事件
            onClick={choiceReturnEvent.emit}
          />
        ]);
      };

      // 监听
      const removeListenerList = [
        // 显示事件
        textEvent.on(showText),
        choiceEvent.on(showChoice),
        // 生命周期事件
        lifeEvent.end.on(() => {
          console.log('game end');
          // 游戏结束，取消所有事件监听
          removeListenerList.forEach(removeListener => removeListener());
          clearGame();
        }),
        lifeEvent.restart.on(() => {
          clearGame();
          startGame();
        }),
      ];

      // try {
      //   // 没有出错，将错误信息置空
      //   store.setErrorInfo('');
      // } catch (e) {
      //   store.setErrorInfo('代码编写出错！\n' + (e as Error).message);
      //   clearGame();
      // }
    };
    
    lifeEvent.start.on(() => {
      const { script } = store;
      loadScript({
        script
      });
      startGame();
    });
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