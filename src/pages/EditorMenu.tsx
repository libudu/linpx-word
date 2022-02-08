import React, { useEffect, useState } from 'react';
import Text from '@/components/GameElement/Text';
import { fileApi } from '@/utils/fileSystem';
import TestScript from '@/../scripts/test.js?raw'
import { store } from '@/store';
import DeleteImg from '@/static/icons/delete.png';
import { ConfirmModal } from './EditorFuncButtons';

// 继续上次编辑
// 从模板开始
// 从空文件开始

const EditorMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [fileList, setFileList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const fileListResult = fileApi.getFileList().sort();
    console.log(fileListResult);
    setFileList(fileListResult);
  }, [refresh]);
  return (
    <div className='w-full h-full bg-gray-300 flex flex-col items-center text-2xl'>
      <Text content="<text glow='orange'>LINPX-WORD</text>" className='text-6xl mt-32' />
      <div className='mt-16 mr-52 leading-10'>
        <div
          className='px-2 hover:bg-gray-400 rounded-md cursor-pointer'
          onClick={() => {
            const fileName = fileApi.newFile('新建模板脚本');
            store.setFileName(fileName);
            store.setScript(TestScript);
            onClose();
          }}
        >
          新建模板脚本
        </div>
        <div
          className='px-2 hover:bg-gray-400 rounded-md cursor-pointer'
          onClick={() => {
            const fileName = fileApi.newFile('新建空脚本');
            store.setFileName(fileName);
            store.setScript('');
            onClose();
          }}
        >
          新建空脚本
        </div>
        {
          fileList.length > 0 &&
          <>
            <div className='px-2 rounded-md'>脚本列表</div>
            <div className='ml-8'>
              {
                fileList.map(file => (
                  <div
                    key={file}
                    className='pl-2 hover:bg-gray-400 rounded-md cursor-pointer w-60 flex justify-between'
                    onClick={async () => {
                      const content = await fileApi.readFile(file);
                      store.setFileName(file);
                      store.setScript(content);
                      onClose();
                    }}
                  >
                    <div className='u-line-1'>
                      { file }
                    </div>
                    <div
                      className='w-10 hover:bg-gray-500 p-1 rounded-md flex-shrink-0'
                      onClick={(e) => {
                        e.stopPropagation();
                        store.setEditorModal(
                          <ConfirmModal
                            content={
                              <div className='text-center px-4'>
                                <div>确定删除该代码文件吗？</div>
                              </div>
                            }
                            onConfirm={() => {
                              fileApi.deleteFile(file);
                              setRefresh(refresh + 1);
                            }}
                          />
                        )
                      }}
                    >
                      <img className='w-6 relative top-1 left-1' src={DeleteImg} />
                    </div>
                  </div>
                ))
              }
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default EditorMenu;