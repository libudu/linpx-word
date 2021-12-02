import React from 'react';

interface DividerProps {
  color?: string;
  width?: number;
}

const Divider: React.FC<DividerProps> = ({ color = 'white', width = 2 }) => {
  return (
    <div className="w-full" style={{ backgroundColor: color, height: width }} />
  );
};

export default Divider