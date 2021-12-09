import React, { useEffect, useState } from 'react';
import anime from 'animejs';

interface ValueBarProps {
  value: number;
  borderColor?: string;
  fillColor?: string;
  width?: number;
  height?: number;
}

const ValueBar: React.FC<ValueBarProps> = ({
  value,
  borderColor,
  fillColor = 'white',
  width = 350,
  height = 34,
}) => {

  const [oldValue, setOldValue] = useState(value);

  useEffect(() => {
    const targets = {
      value: oldValue,
    };
    anime({
      targets,
      value,
      update: () => {
        setOldValue(targets.value);
      }
    })
  }, [value])

  return (
    <div className="relative overflow-hidden rounded-full" style={{ width, height }}>
      {/* 内值 */}
      <div
        className="absolute"
        style={{ width: `${oldValue}%`, height, borderRadius: '99px 0 0 99px', backgroundColor: fillColor }}
      />
      {/* 外框 */}
      <div
        className="absolute rounded-full"
        style={{ width, height, border: '4px solid white', borderColor }}
      />
    </div>
  );
};

export default ValueBar;