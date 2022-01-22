import anime from 'animejs';

export type Target = HTMLElement | null;

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