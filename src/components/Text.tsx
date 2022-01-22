import { useTextAnimeRef } from '@/utils/animeHooks';
import React from 'react';

const Text: React.FC<{ text: string }> = ({ text }) => {
  const ref = useTextAnimeRef();
  return (
    <div ref={ref} className='opacity-0'>
      { text }
    </div>
  )
};

export default Text;