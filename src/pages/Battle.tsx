import React, { useState, useEffect, useRef } from 'react';
import ValueBar from '@/components/ValueBar';
import Divider from '@/components/Divider';
import Text from '@/components/Text';

import LightImg from '@/static/icons/light.svg';
import HeroBadgeImg from '@/static/icons/hero_badge.svg';

import { loadScript } from '@/scripts';
import Choice from '@/components/Choice';

const CPS = 50;

const Battle: React.FC = () => {
  const [value, setValue] = useState(0);
  const [dialogList, setDialogList] = useState<React.ReactElement[]>([]);
  const ref = useRef(dialogList);
  ref.current = dialogList;

  useEffect(() => {
    let i = 0;
    const getKey = () => {
      return i++;
    }
    const startGame = () => {
      const { goNext } = loadScript({
        // 文本
        showText: (text) => {
          setDialogList([...ref.current, <Text key={getKey()} text={text} />]);
          // 显示之后延迟500ms动画时间 + 300ms基础时间 + 文字/每秒阅读字数时间
          setTimeout(() => {
            goNext();
          }, 800 + text.length / CPS * 1000);
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
          setDialogList([]);
          startGame();
        }
      });
      goNext();
    };
    startGame();
  }, []);

  return  (
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
      {/* <div className="flex text-3xl">
        <button onClick={() => setValue(value + 10)}>加10</button>
      </div> */}
      <div className="text-xl px-4">
        {
          dialogList
        }
      </div>
    </>
  );
};

export default Battle;