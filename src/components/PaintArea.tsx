import React, { useEffect, useState } from 'react'
import { fabric } from 'fabric';
import AreaPng from '../static/test.png';
import AreaCoverPng from '../static/test_cover.png';

const initFilterCanvas = async (id: string, onRender: (fill: number, overflow: number) => void) => {
  const width = 200;
  const height = 200;

  // 目标区域数据
  const coverData = await new Promise<Uint8ClampedArray | undefined>((resolve) => {
    fabric.Image.fromURL(AreaPng, (img) => {
      console.log(img.width, img.height)
      const context = img.toCanvasElement().getContext('2d');
      const data = context?.getImageData(0, 0, width, height);
      resolve(data?.data);
    });
  });

  // 画布画笔
  const canvas = new fabric.Canvas(id, { isDrawingMode: true, width, height });
  const canvasEle = canvas.getElement();
  canvasEle.width = width;
  canvasEle.height = height;
  canvasEle.style.background = `url('${AreaCoverPng}')`;
  const context = canvasEle.getContext('2d');
  const brush = canvas.freeDrawingBrush;
  brush.color = '#f00';
  brush.width = 20;

  // 计算占比
  canvas.on('after:render', () => {
    if(!context) return;

    const data = context.getImageData(0, 0, width, height)?.data;
    if(data && coverData) {
      // 目标区域：填色图案黑色部分
      const target = coverData.filter((d, i) => i % 4 == 3 && d).length;
      // 涂色区域：已涂的红色区域
      const paintArea = data.filter((d, i) => i % 4 == 0 && coverData[i + 3] && d).length
      // 溢出区域：红色在填色图案之外的区域
      const overflowArea = data.filter((d, i) => i % 4 == 0 && !coverData[i + 3] && d).length
      onRender(paintArea / target, overflowArea / width / height);
    }
  });

  return {
    clear: () => canvas.clear(),
  }
};

const Home: React.FC = () => {
  const [area, setArea] = useState([0, 0]);
  const [clearFunc, setClearFunc] = useState<any>();

  useEffect(() => {
    (async () => {
      const { clear } = await initFilterCanvas('c', (fill, overflow) => setArea([fill, overflow]));
      setClearFunc(() => clear);
    })();
  }, []);

  return (
    <React.Fragment>
      <main className="flex justify-center">
        <div>
          <canvas id="c" style={{ border: '1px solid #888' }}>

          </canvas>
          <div>
            覆盖区域：{area[0].toFixed(2)}
          </div>
          <div>
            溢出区域：{area[1].toFixed(2)}
          </div>
          <button onClick={() => clearFunc()}>清空</button>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Home
