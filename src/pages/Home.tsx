import React, { useRef, useEffect, useState } from 'react';
import { throttle } from 'lodash';
import Battle from './Battle';
import Editor from './Editor';
import { observer } from 'mobx-react';
import { store } from '@/store';
import { isScreenSmall } from '@/utils';

// 封装弹性自适应页面逻辑
const Home: React.FC = () => {
  const { running, setRunning } = store;
  // 动态处理游戏区大小
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  
  const gameWidth = 500;
  const editorWidth = Math.min(innerWidth, 600);

  const isSmall = isScreenSmall();

  useEffect(() => {
    const refreshSize = throttle(() => {
      const relativeWidth = 500;
  
      const windowAspectRatio = innerHeight / innerWidth;
      // 相对宽500，相对长最大1000最小800，一般显示器是16:9=1.78左右
      const maxAspectRatio = 2;
      const minAspectRatio = 1.6;
      // 屏幕很长，宽度为准
      if(windowAspectRatio > maxAspectRatio) {
        setHeight(relativeWidth * maxAspectRatio);
        setZoom(innerWidth / relativeWidth);
        console.log(innerWidth, relativeWidth)
      }
      // 屏幕很宽，以长度为准
      else if(windowAspectRatio < minAspectRatio) {
        const relativeHeight = relativeWidth * minAspectRatio;
        setHeight(relativeHeight);
        setZoom(innerHeight / relativeHeight)
      }
      // 适中，长宽填满可以随意变化
      else {
        setZoom(innerWidth / relativeWidth);
        setHeight(null);
      }
    }, 200);
    refreshSize();
    window.onresize = refreshSize;
  }, []);
 
  return (
    <div className="w-screen h-screen bg-gray-900 flex justify-center items-center overflow-x-scroll scrollbar-hidden">
      {
        zoom &&
        <>
          {
            (!isSmall || !running) &&
            <div
              className='h-screen rounded-lg'
              style={{ width: editorWidth, maxWidth: '100vw' }}
            >
              <Editor />
            </div>
          }
          {
            (!isSmall || running) &&
            <div
              className="bg-black text-white"
              style={{ width: gameWidth, height: height ? height : '100%', zoom }}
              ref={ref}
            >
              <Battle />
            </div>
          }
          {
            (isSmall && running) &&
            <div
              className='absolute bg-red-500 w-28 h-10 rounded-full pl-4 pt-1.5 text-lg'
              style={{ bottom: '40%', right: -18 }}
              onClick={() => setRunning(false)}
            >
              停止运行
            </div>
          }
        </>
      }
    </div>
  )
};

export default observer(Home);