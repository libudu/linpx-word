import { useTextAnimeRef } from '@/utils/animeHooks';
import React, { useState } from 'react';

const Choice: React.FC<{
  choiceList: string[],
  onClick: (index: number) => void;
}> = ({ choiceList, onClick }) => {
  const [click, setClick] = useState(false);
  const ref = useTextAnimeRef();
  
  return (
    <div ref={ref} className='flex justify-around'>
      {
        choiceList.map((choice, index) => (
          <div
            className='bg-gray-600 rounded-lg py-2 px-4 my-2'
            key={index}
            onClick={() => {
              if(!click) {
                onClick(index);
                setClick(true);
              }
            }}>
            { choice }
          </div>
        ))
      }
    </div>
  )
};

export default Choice;