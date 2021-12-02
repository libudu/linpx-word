import React, { useState } from 'react';
import ValueBar from '@/components/ValueBar';
import Divider from '@/components/Divider';

import LightImg from '@/static/icons/light.svg';
import HeroBadgeImg from '@/static/icons/hero_badge.svg';

const Battle: React.FC = () => {
  const [value, setValue] = useState(0);
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
      <button onClick={() => setValue(value + 10)}>加10</button>
    </>
  );
};

export default Battle;