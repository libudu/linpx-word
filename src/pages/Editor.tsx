import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { throttle } from 'lodash';
import CodeEditor from '@/components/CodeEditor';
import { store } from '@/store';
import { lifeEvent } from '@/scripts/event';
import { fileApi } from '@/utils/fileSystem';
import EditorMenu from './EditorMenu';
import { FuncButton, FuncButtonList } from './EditorFuncButtons';

import TestScript from '@/../scripts/test.js?raw'
import LeftImg from '@/static/icons/left.png';

// 将最后一次编辑的内容保存到缓存中，下次进入时加载
const cacheScriptToFileSystem = throttle((file: string, script: string) => {
  fileApi.writeFile(file, script);
}, 1000, { leading: false });

const Editor: React.FC = () => {
  const { running, setRunning, setScript, setRunningMode, editorModal } = store;

  const [showMenu, setShowMenu] = useState(true);
  const ref = useRef<any>();
  useEffect(() => {
    if(ref.current) {
      store.setEditor(ref.current.editor);
      store.setEditorScript(store.script);
    }
  }, [ref.current]);

  if(showMenu) {
    return <EditorMenu onClose={() => setShowMenu(false)} />;
  }

  return (
    <div
      className='w-full h-full flex flex-col bg-gray-200 relative'
    >
      <div
        className='absolute left-2 top-2 w-9 p-1.5 rounded-md hover:bg-gray-400'
        onClick={() => setShowMenu(true)}
      >
        <img src={LeftImg} />
      </div>
      <div className='text-2xl text-center pt-2 pb-1'>
        { store.fileName }
      </div>
      <div className='text-lg flex-wrap  py-0.5 mb-0.5 flex bg-gray-200 justify-center'>
        {
          FuncButtonList.map(props => <FuncButton key={props.name} {...props} />)
        }
      </div>
      <div className='w-full flex-grow overflow-hidden relative'>
        <CodeEditor
          cmRef={ref}
          initText={TestScript}
          setText={(value) => {
            setScript(value);
            cacheScriptToFileSystem(store.fileName, value);
          }}
        />
        {
          editorModal &&
          <div
            className={`bg-gray-500 bg-opacity-50 w-full h-full z-10 absolute left-0 top-0 
              flex justify-center items-center p-4 whitespace-pre-line text-xl`}
          >
            { editorModal }
          </div>
        }
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
      <div className='text-center text-xl sm:text-3xl'>
        {
          running
          ? <div
              className='w-full bg-red-400 hover:bg-red-300 py-3'
              onClick={() => {
                setRunning(!running);
                lifeEvent.end.emit();
            }}>
              停止运行
            </div>
          : 
            <div className='flex'>
              <div
                className='flex-grow hover:bg-gray-300 py-3'
                style={{ borderRight: '2px solid #888' }}
                onClick={() => {
                  setRunningMode('product');
                  setRunning(!running);
                  lifeEvent.start.emit();
                }}
              >
                开始运行
              </div>
              <div
                className='flex-grow hover:bg-gray-300 py-3'
                onClick={() => {
                  setRunningMode('dev');
                  setRunning(!running);
                  lifeEvent.start.emit();
                }}
              >
                测试运行
              </div>
            </div>
        }
      </div>
    </div>
  );
};

export default observer(Editor);