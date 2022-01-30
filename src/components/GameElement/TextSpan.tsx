import React from 'react';
import { animeParams, useAnimeListRef, useGlowAnimeStyle } from "@/utils/animeHooks";

const TextSpan: React.FC<{
  shake?: boolean;
  glow?: string;
  style: React.CSSProperties;
}> = ({ shake, glow, style, children }) => {
  const ref = useAnimeListRef([
    shake && animeParams.getShake(),
  ]);
  const glowStyle = useGlowAnimeStyle({ enable: Boolean(glow), color: glow })
  return (
    <span
      ref={ref}
      style={{ ...style, position: 'relative', transition: '1s text-shadow', ...glowStyle }}
    >
      { children }
    </span>
  );
};

export default TextSpan;