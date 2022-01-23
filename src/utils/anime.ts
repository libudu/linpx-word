import anime from 'animejs';

export type Target = HTMLElement | null;

// 从底部向上滑动，渐隐出现
export const bottomFadeIn = ({
  target,
  initYpos = 10,
}: {
  target: Target;
  initYpos?: number;
}) => {
  if(!target) {
    return;
  }
  anime({
    targets: target,
    opacity: [0, 1.0],
    translateY: [initYpos, 0],
    duration: 500,
    easing: 'easeInQuad',
  });
};