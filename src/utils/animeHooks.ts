import anime, { AnimeInstance, AnimeParams } from 'animejs';
import React, { useEffect, useRef, useState } from 'react';
import tinycolor from 'tinycolor2';

const getRandomList = (count: number, base: number, length: number) => {
  let result: number[] = [];
  for(let i = 0; i < count; i++) {
    const t = 0.5 - Math.random();
    const n = (t > 0 ? 1 : -1) * (base + t * length);
    result.push(n);
  }
  return result;
};

export const animeParams = {
  // 抖动
  getShake: () => {
    const count = 200;
    const fps = 20;
    return {
      top: getRandomList(count, 2, 4),
      left: getRandomList(count, 2, 4),
      duration: count / fps * 1000,
      easing: 'linear',
      loop: true,
    };
  },
  // 从底部向上滑动，渐隐出现
  getBottomFadeIn: (props?: {
    initYpos?: number
  }) => {
    const { initYpos } = props || { initYpos: 10 };
    return {
      opacity: [0, 1.0],
      translateY: [initYpos, 0],
      duration: 500,
      easing: 'easeInQuad',
    };
  },
};

// 对一个节点使用多种动画
// 传入多个animeParams，返回使用多个动画的ref
export const useAnimeListRef = (animeParamList: (Omit<AnimeParams, 'targets'> | false)[]) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(ref.current) {
      const target = ref.current;
      // 逐个应用
      animeParamList.filter(i => i).forEach(animeParam => {
        anime({
          targets: target,
          ...animeParam,
        });
      });
      // 组件卸载时清空动画，避免循环动画导致的内存泄漏
      return () => anime.remove(target);
    }
  }, []);
  return ref;
};

export const useTextAnimeRef = () => {
  return useAnimeListRef([ animeParams.getBottomFadeIn() ])
};


const partList = '1px 1px 4px'.split(' ');
const getDeepShadowStyle = (color: string) => {
  // return `0 0 2px ${color}`;
  return [['', ''], ['-', ''], ['', '-'], ['-', '-']].map(([x, y]) => {
    return `${x}${partList[0]} ${y}${partList[1]} ${partList[2]} ${color}`;
  }).join(',');
}
export const useGlowAnimeStyle = ({
  enable,
  color,
}: {
  enable: boolean;
  color: string;
}): React.CSSProperties => {
  const [ textShadow, setTextShadow ] = useState(getDeepShadowStyle(color));
  useEffect(() => {
    if(enable) {
      let i = true;
      // 发光和暗淡的textShadow
      const glowTextShadow = getDeepShadowStyle(color);
      const fadeColor = tinycolor(color).setAlpha(0).toHex8String();
      const fadeTextShadow = getDeepShadowStyle(fadeColor);
      // 间隔时间在两种textShadow中切换
      const timer = setInterval(() => {
        i = !i;
        setTextShadow(i ? glowTextShadow : fadeTextShadow );
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [enable]);
  if(!enable) return {};
  return {
    transition: '1s text-shadow',
    textShadow,
  };
};