import React from 'react';
import CodeEditor from '@/components/CodeEditor';
import { observer } from 'mobx-react';
import { store } from '@/store';
import { emitEvent, GameEvent } from '@/utils/event';

const Editor: React.FC = () => {
  const { running, setRunning, script, setScript, setRunningMode } = store;
  return (
    <div
      className='w-full h-full flex flex-col bg-gray-200'
    >
      <div className='text-2xl text-center py-2'>
        代码区
        <span className='text-lg ml-2'>(语言：轻改JavaScript)</span>
      </div>
      <div className='w-full flex-grow overflow-hidden relative'>
        <CodeEditor
          text={script}
          setText={setScript}
        />
        {
          running &&
          <div
            className={`bg-gray-500 bg-opacity-50 w-full h-full z-10 absolute left-0 top-0 
              text-red-600 flex justify-center items-center p-4 whitespace-pre-line text-xl`}
          >
            { store.errorInfo }
          </div>
        }
      </div>
      {
        running
        ? <div
            className='w-full text-center bg-red-400 hover:bg-red-300 text-3xl py-3'
            onClick={() => {
              setRunning(!running);
              emitEvent(GameEvent.gameEnd)
          }}>
            停止运行
          </div>
        : 
          <div className='flex'>
            <div
              className='flex-grow text-center hover:bg-gray-300 text-3xl py-3'
              style={{ borderRight: '2px solid #888' }}
              onClick={() => {
                setRunningMode('product');
                setRunning(!running);
                emitEvent(GameEvent.gameStart)
              }}
            >
              开始运行
            </div>
            <div
              className='flex-grow text-center hover:bg-gray-300 text-3xl py-3'
              onClick={() => {
                setRunningMode('dev');
                setRunning(!running);
                emitEvent(GameEvent.gameStart);
              }}
            >
              测试运行
            </div>
          </div>
      }
    </div>
  );
};

export default observer(Editor);