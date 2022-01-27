import React, { useEffect, useRef } from 'react';
import CodeEditor from '@/components/CodeEditor';
import { observer } from 'mobx-react';
import { store } from '@/store';
import { lifeEvent } from '@/scripts/event';

import DeleteImg from '@/static/icons/delete.png';
import DownloadImg from '@/static/icons/download.png';
import ResetImg from '@/static/icons/reset.png';
import FileImg from '@/static/icons/file.png';
import RedoImg from '@/static/icons/redo.png';
import UndoImg from '@/static/icons/undo.png';

import TestScript from '@/../scripts/test.js?raw'
import { getChooseFileText, downloadText } from '@/utils';


interface FuncButtonProps {
  name: string;
  icon?: string;
  width?: number;
  onClick?: () => void;
}

const FuncButton: React.FC<FuncButtonProps> = ({ name, icon, width = 22, onClick }) => {
  return (
    <div
      className='flex py-1 px-2 mx-1 cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md'
      onClick={onClick}
    >
      {
        icon && <img className='object-contain mr-1' src={icon} style={{ width }} />
      }
      <div>{ name }</div>
    </div>
  );
};

const ConfirmModal: React.FC<{ content: React.ReactChild; onConfirm: () => void; }> = ({ content, onConfirm }) => {
  return (
    <div className='bg-white rounded-lg p-4 break-words whitespace-pre-line'>
      {content}
      <div className='flex justify-between mt-4'>
        <FuncButton
          name="确定"
          onClick={() => {
            onConfirm();
            store.setEditorModal(undefined);
          }}
        />
        <FuncButton
          name="取消"
          onClick={() => store.setEditorModal(undefined)}
        />
      </div>
    </div>
  );
};

const FuncButtonList: FuncButtonProps[] = [
  {
    name: '撤销',
    icon: UndoImg,
    onClick: () => store.editor?.undo(),
  },
  {
    name: '恢复',
    icon: RedoImg,
    onClick: () => store.editor?.redo(),
  },
  {
    name: '清空',
    icon: DeleteImg,
    width: 20,
    onClick: () => {
      store.setEditorModal(
        <ConfirmModal
          content={
            <div className='text-center px-4'>
              <div>确定清空当前代码吗</div>
              <div>清空后可撤销</div>
            </div>
          }
          onConfirm={() => store.setEditorScript('')}
        />
      );
    },
  },
  {
    name: '重置',
    icon: ResetImg,
    width: 20,
    onClick: () => {
      store.setEditorModal(
        <ConfirmModal
          content={
            <div className='text-center px-4'>
              <div>确定重置为模板代码吗</div>
              <div>重置后可撤销</div>
            </div>
          }
          onConfirm={() => store.setEditorScript(TestScript)}
        />
      );
    },
  },
  {
    name: '加载',
    icon: FileImg,
    onClick: async () => {
      const text = await getChooseFileText();
      store.setEditorScript(text);
    },
  },
  {
    name: '下载',
    icon: DownloadImg,
    onClick: () => {
      downloadText(store.script);
    },
  },
];

const Editor: React.FC = () => {
  const { running, setRunning, setScript, setRunningMode, editorModal } = store;
  const ref = useRef<any>();
  useEffect(() => {
    // 设置初始脚本，加载编辑器
    store.setScript(TestScript);
    store.setEditor(ref.current.editor);
  }, []);

  return (
    <div
      className='w-full h-full flex flex-col bg-gray-200'
    >
      <div className='text-2xl text-center pt-2 pb-1'>
        代码区
        <span className='text-lg ml-2'>(语言：轻改JavaScript)</span>
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
          setText={setScript}
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