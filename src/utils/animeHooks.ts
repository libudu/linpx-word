import { useEffect, useRef } from 'react';
import { bottomFadeIn } from './anime';
import { Target } from './anime';

export const useAnimeRef = <T extends { target: Target }>(
  animeFunc: (props: T) => void,
  args?: Omit<T, 'target'>,
) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // @ts-ignore
    animeFunc({ ...args, target: ref.current });
  }, []);
  return ref;
};

export const useTextAnimeRef = () => {
  return useAnimeRef(bottomFadeIn);
};