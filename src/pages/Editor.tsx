import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { throttle } from 'lodash';
import CodeEditor from '@/components/CodeEditor';
import { store } from '@/store';
import { lifeEvent } from '@/scripts/event';
import { fileApi } from '@/utils/fileSystem';
import { FuncButton, FuncButtonList } from './EditorFuncButtons';

import LeftImg from '@/static/icons/left.png';

// 将最后一次编辑的内容保存到缓存中，下次进入时加载
const cacheScriptToFileSystem = throttle((file: string, script: string) => {
  fileApi.writeFile(file, script);
}, 1000, { leading: false });

const Editor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { running, script, fileName, setRunning, setScript, setRunningMode, setFileName } = store;

  const [tempFileName, setTempFileName] = useState(fileName);
  // 初始脚本、编辑器ref
  const [initScript, setInitScript] = useState(script);
  const ref = useRef<any>();
  useEffect(() => {
    setInitScript(script);
    store.setEditor(ref.current.editor);
    store.setEditorScript(store.script);
  }, []);

  return (
    <div
      className='w-full h-full flex flex-col bg-gray-200 relative'
    >
      <div
        className='absolute left-2 top-2 w-9 p-1.5 rounded-md hover:bg-gray-400'
        onClick={() => onClose()}
      >
        <img src={LeftImg} />
      </div>
      <div className='text-2xl text-center pt-2 pb-1'>
        <input
          className='bg-transparent outline-none hover:bg-white focus:bg-white text-center'
          value={tempFileName}
          onChange={(e) => {
            const name = e.target.value;
            setTempFileName(name);
          }}
          onBlur={(e) => {
            const name = e.target.value;
            // 无效或重名，修改无效
            if(!name || fileApi.existFile(name)) {
              setTempFileName(fileName);
              return;
            }
            // 尝试修改，成功则成功
            try {
              fileApi.renameFile(fileName, name);
              setFileName(name);
            } catch (error) {
              console.log(error);
              setTempFileName(fileName);
            }
          }}
        />
      </div>
      <div className='text-lg flex-wrap  py-0.5 mb-0.5 flex bg-gray-200 justify-center'>
        {
          FuncButtonList.map(props => <FuncButton key={props.name} {...props} />)
        }
      </div>
      <div className='w-full flex-grow overflow-hidden'>
        <CodeEditor
          cmRef={ref}
          initText={initScript}
          setText={(value) => {
            setScript(value);
            cacheScriptToFileSystem(fileName, value);
          }}
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
      <div className='text-center text-xl sm:text-3xl'>
        {
          running
          ? <div
              className='w-full bg-red-400 hover:bg-red-300 py-3 relative z-10'
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