import React, { useState, useEffect, useRef } from 'react';
import ValueBar from '@/components/ValueBar';
import Divider from '@/components/Divider';
import Text from '@/components/GameElement/Text';

import LightImg from '@/static/icons/light.svg';
import HeroBadgeImg from '@/static/icons/hero_badge.svg';

import { loadScript } from '@/scripts';
import Choice from '@/components/GameElement/Choice';
import { observer } from 'mobx-react';
import { store } from '@/store';
import { choiceEvent, choiceReturnEvent, IChoice, lifeEvent, textEvent } from '@/scripts/event';
import { IText } from '@/scripts/event';

const Game: React.FC = () => {
  const [value, setValue] = useState(0);
  const [dialogList, setDialogList] = useState<React.ReactElement[]>([]);
  const dialogRef = useRef(dialogList);
  dialogRef.current = dialogList;
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const startGame = () => {
      const scrollToBottom = () => {
        containerRef.current.scrollTo({ top: 99999, behavior: 'smooth' });
      };
      const getKey = (() => {
        let i = 0;
        return () => i++;
      })();

      const showText = (text: IText) => {
        setDialogList([
          ...dialogRef.current,
          <Text
            key={getKey()}
            {...text}
            onAnimateEnd={lifeEvent.goNext.emit}
          />
        ]);
        scrollToBottom();
      };

      const showChoice = ({ items, animate }: IChoice) => {
        setDialogList([
          ...dialogRef.current,
          <Choice
            key={getKey()}
            animate={animate}
            choiceList={items}
            // 点击后触发choiceReturn事件
            onClick={choiceReturnEvent.emit}
          />
        ]);
        scrollToBottom();
      };
      
      // 监听
      const removeListenerList = [
        // 显示事件
        textEvent.on(showText),
        choiceEvent.on(showChoice),
        // 生命周期事件
        lifeEvent.end.on(() => {
          // 游戏结束，取消所有事件监听
          removeListenerList.forEach(removeListener => removeListener());
          setDialogList([]);
          // 错误信息清空
          store.setErrorInfo("");
        }),
        lifeEvent.error.on((e) => {
          store.setErrorInfo('代码执行出错！\n' + e);
        }),
        lifeEvent.restart.on(() => {
          // 取消上次的监听
          removeListenerList.forEach(removeListener => removeListener());
          setDialogList([]);
          // 延迟启动，避免与脚本引擎的restart时序竞争
          setTimeout(() => {
            startGame();
          }, 100);
        }),
      ];

      // 加载脚本启动引擎
      const { script } = store;
      loadScript({ script });
    };
    
    return lifeEvent.start.on(() => {
      try {
        startGame();
      } catch (e) {
        setDialogList([]);
        store.setErrorInfo('代码编写出错！\n' + (e as Error).message);
      }
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
      <div className="text-xl px-4 flex-grow overflow-y-scroll scrollbar-hidden pb-16" ref={containerRef}>
        {
          dialogList
        }
      </div>
    </div>
  );
};

export default observer(Game);