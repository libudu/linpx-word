import { Editor } from 'codemirror';
import { makeAutoObservable } from 'mobx';

class Core {
  constructor() {
    makeAutoObservable(this);
  }

  running = false;
  runningMode: 'dev' | 'product' = 'dev';
  script = '';
  errorInfo = '';
  editor: Editor | undefined;
  editorModal: JSX.Element | undefined;

  setRunning = (running: boolean) => {
    this.running = running;
  };

  // 仅用于初始化和CodeMirror的change函数
  setScript = (script: string) => {
    this.script = script;
  };
  
  // 用于改写CodeMirror的值
  setEditorScript = (script: string) => {
    if(this.editor) {
      this.editor.setValue(script);
      this.script = script;
    } else {
      console.log('全局editor尚未初始化！');
    }
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