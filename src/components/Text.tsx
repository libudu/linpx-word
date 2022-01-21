import anime from 'animejs';
import React, { useEffect, useRef } from 'react';

const Text: React.FC<{ text: string }> = ({ text }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    anime({
      targets: ref.current,
      opacity: 1.0,
      translateY: 0,
      duration: 500,
      easing: 'easeInQuad',
      update: () => {
        ref.current?.style.transform
      }
    })
  }, []);
  return (
    <div ref={ref} style={{ transform: `translateY(10px)`, opacity: 0 }}>
      { text }
    </div>
  )
};

export default Text;