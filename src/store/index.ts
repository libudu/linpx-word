import { makeAutoObservable } from 'mobx';

class Core {
  constructor() {
    makeAutoObservable(this);
  }

  running = false;
  runningMode: 'dev' | 'product' = 'dev';
  script = '';
  errorInfo = '';

  setRunning = (running: boolean) => {
    this.running = running;
  };

  setScript = (script: string) => {
    this.script = script;
  };

  setErrorInfo = (errorInfo: string) => {
    this.errorInfo = errorInfo;
  };

  setRunningMode = (mode: typeof this.runningMode) => {
    this.runningMode = mode;
  };
}

export const store = new Core();