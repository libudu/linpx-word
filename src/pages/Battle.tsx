import React, { useState, useEffect } from 'react';
import ValueBar from '@/components/ValueBar';
import Divider from '@/components/Divider';
import Text from '@/components/Text';

import LightImg from '@/static/icons/light.svg';
import HeroBadgeImg from '@/static/icons/hero_badge.svg';

import { loadScript } from '@/scripts';

let _dialogList: any[];

const Battle: React.FC = () => {
  const [value, setValue] = useState(0);
  const [dialogList, setDialogList] = useState<any[]>([]);

  _dialogList = dialogList;

  useEffect(() => {
    loadScript({
      onText: (text) => {
        setDialogList([..._dialogList, <Text key={_dialogList.length} text={text} />]);
        console.log('receive', text);
      },
    });
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
      <div className="flex text-3xl">
        <button onClick={() => setValue(value + 10)}>加10</button>
        <button
          className="ml-2"
          onClick={() => {
            setDialogList([...dialogList, <Text key={dialogList.length} text="你好" />])
          }}
        >
          增加对话
        </button>
      </div>
      <div className="text-xl">
        {
          dialogList
        }
      </div>
    </>
  );
};

export default Battle;