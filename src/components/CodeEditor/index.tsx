import React, { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
// 高亮选中行
import 'codemirror/addon/selection/active-line';
// 自动提示
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
// 代码折叠
import 'codemirror/addon/fold/foldgutter.css'; 
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';  
import 'codemirror/addon/fold/brace-fold.js';  
import 'codemirror/addon/fold/comment-fold.js';
// 代码提示
import { hint } from './hint';
// 主题
import 'codemirror/theme/xq-light.css';

const CodeEditor: React.FC<{
  initText: string;
  setText: (text: string) => void;
  readOnly?: boolean;
  cmRef?: React.MutableRefObject<any>;
}> = ({ initText, setText, readOnly = false, cmRef }) => {
  return (
    <CodeMirror
      ref={cmRef}
      className='w-full h-full'
      options={{
        theme: 'xq-light',
        tabSize: 2,
        readOnly,
        mode: 'text/javascript',
        lineNumbers: true,
        smartIndent: true,
        // 高亮选中行
        styleActiveLine: true,
        // 代码折叠
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        hintOptions: {
          // 避免只有一个提示项时直接选择
          completeSingle: false,
          // 使用自定义hint
          hint,
        }
      }}
      value={initText}
      onCursorActivity={(e) => {
        e.showHint();
      }}
      onBeforeChange={(editor, data, value) => {
        setText(value);
      }}
    />
  );
};

export default CodeEditor;