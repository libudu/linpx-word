import scriptTransform from '@/scripts/transform';
import { createWorker } from './worker';
import { choiceReturnEvent, lifeEvent } from '@/scripts/event';

export const loadScript = ({
  script,
}: {
  script: string;
}) => {
  // 开始游戏，创建worker并构建worker api
  const finalScript = scriptTransform(script);
  if(finalScript) {
    const w = createWorker(finalScript);
    const removeListenerList = [
      // 选项返回事件
      choiceReturnEvent.on((choice) => {
        w.postMessage({
          method: '_return',
          args: choice,
        });
        w.postMessage({
          method: 'goNext',
        });
      }),
      // 生命周期事件
      lifeEvent.goNext.on(() => {
        w.postMessage({
          method: 'goNext',
        });
      }),
      lifeEvent.error.on(() => {
        w.terminate();
        removeListenerList.forEach(removeListener => removeListener());
      }),
      lifeEvent.end.on(() => {
        w.terminate();
        removeListenerList.forEach(removeListener => removeListener());
      }),
      lifeEvent.restart.on(() => {
        w.terminate();
        removeListenerList.forEach(removeListener => removeListener());
      }),
    ];
  }
};