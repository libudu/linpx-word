import React, { useState } from 'react';
import TestScript from '@/../scripts/test.ts?raw';
import CodeEditor from '@/components/CodeEditor';


interface EditorProps {
  onStart: (script: string) => void;
}

const Editor: React.FC<EditorProps> = ({ onStart }) => {
  const [text, setText] = useState(TestScript);
  return (
    <div
      className='h-screen flex flex-col rounded-lg overflow-hidden bg-gray-200'
      style={{ width: 600 }}
    >
      <div className='text-2xl text-center py-2'>
        代码区(语言：轻改JavaScript)
      </div>
      <CodeEditor
        text={text}
        setText={setText}
      />
      <div
        className='w-full text-center hover:bg-gray-300 text-3xl py-3'
        onClick={() => onStart(text)}
      >
        开始运行
      </div>
    </div>
  );
};

export default Editor;