import { Editor } from 'codemirror';
import { makeAutoObservable } from 'mobx';

class Core {
  constructor() {
    makeAutoObservable(this);
  }

  running = false;
  runningMode: 'dev' | 'product' = 'dev';
  errorInfo = '';
  fileName = '';
  script = '';
  editor: Editor | undefined;
  editorModal: JSX.Element | undefined;

  setRunning = (running: boolean) => {
    this.running = running;
  };

  // 记录编辑器中的最新文本
  setScript = (script: string) => {
    this.script = script;
  };
  
  // 实际改写编辑器中的值
  setEditorScript = (script: string) => {
    if(this.editor) {
      this.editor.setValue(script);
      this.script = script;
    } else {
      console.log('全局editor尚未初始化！');
    }
  };

  // 脚本文件名
  setFileName = (name: string) => {
    this.fileName = name;
  };

  setErrorInfo = (errorInfo: string) => {
    this.errorInfo = errorInfo;
  };

  setRunningMode = (mode: typeof this.runningMode) => {
    this.runningMode = mode;
  };

  setEditor = (editor: Editor) => {
    this.editor = editor;
  };

  setEditorModal = (element: JSX.Element | undefined) => {
    this.editorModal = element;
  };
}

export const store = new Core();