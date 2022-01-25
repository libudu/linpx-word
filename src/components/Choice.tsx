import { useTextAnimeRef } from '@/utils/animeHooks';
import React, { useState } from 'react';
import classnames from 'classnames';

const Choice: React.FC<{
  choiceList: string[],
  onClick: (index: number) => void;
}> = ({ choiceList, onClick }) => {
  const [click, setClick] = useState<number | null>(null);
  const ref = useTextAnimeRef();
  
  return (
    <div ref={ref} className='flex justify-around opacity-0'>
      {
        choiceList.map((choice, index) => (
          <div
            className={classnames('bg-gray-600 rounded-lg py-2 px-4 my-2', { 'opacity-0': click != null && index != click })}
            style={{ transition: '0.4s all' }}
            key={index}
            onClick={() => {
              if(click == null) {
                onClick(index);
                setClick(index);
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