import React, { useRef, useEffect, useState } from 'react';
import { throttle } from 'lodash';
import Battle from './Battle';

// 封装弹性自适应页面逻辑
const Home: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    const refreshSize = throttle(() => {
      const relativeWidth = 500;
  
      const { innerHeight, innerWidth } = window;
      const windowAspectRatio = innerHeight / innerWidth;
      // 相对宽500，相对长最大1000最小800，一般显示器是16:9=1.78左右
      const maxAspectRatio = 2;
      const minAspectRatio = 1.6;
      // 屏幕很长，宽度为准
      if(windowAspectRatio > maxAspectRatio) {
        setHeight(relativeWidth * maxAspectRatio);
        setZoom(innerWidth / relativeWidth);
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
    <div className="w-screen h-screen bg-gray-900 flex justify-center items-center overflow-y-scroll">
      {
        zoom &&
        <div
          className="bg-black text-white"
          style={{ width: 500, height: height ? height : '100%', zoom }}
          ref={ref}
        >
          <Battle />
        </div>
      }
    </div>
  )
};

export default Home;