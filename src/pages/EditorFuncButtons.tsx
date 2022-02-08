import React from 'react';
import { store } from '@/store';
import { getChooseFileText, downloadText } from '@/utils';
import TestScript from '@/../scripts/test.js?raw'

import DeleteImg from '@/static/icons/delete.png';
import DownloadImg from '@/static/icons/download.png';
import ResetImg from '@/static/icons/reset.png';
import FileImg from '@/static/icons/file.png';
import RedoImg from '@/static/icons/redo.png';
import UndoImg from '@/static/icons/undo.png';

interface FuncButtonProps {
  name: string;
  icon?: string;
  width?: number;
  onClick?: () => void;
}

export const FuncButton: React.FC<FuncButtonProps> = ({ name, icon, width = 22, onClick }) => {
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


export const ConfirmModal: React.FC<{ content: React.ReactChild; onConfirm: () => void; }> = ({ content, onConfirm }) => {
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

export const FuncButtonList: FuncButtonProps[] = [
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