import { useTextAnimeRef } from '@/utils/animeHooks';
import React, { useState } from 'react';
import classnames from 'classnames';
import { IChoice } from '@/scripts/event';

const Choice: React.FC<{
  animate: IChoice['animate'],
  choiceList: string[],
  onClick: (index: number) => void;
}> = ({ choiceList, onClick, animate }) => {
  const [click, setClick] = useState<number | null>(null);
  const ref = useTextAnimeRef();

  const hideAll = click != null && animate == 'hide';
  const hideClicked = click != null && animate != 'show';
  const transition = animate == 'fade' ? '0.4s all' : '';
  
  return (
    <div ref={ref} className={classnames('flex justify-around opacity-0', { hidden: hideAll })}>
      {
        choiceList.map((choice, index) => (
          <div
            className={classnames(
              'bg-gray-600 rounded-lg py-2 px-4 my-2', 
              { 'opacity-0': hideClicked && index != click }
            )}
            style={{ transition }}
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