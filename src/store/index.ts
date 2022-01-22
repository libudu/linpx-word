import { makeAutoObservable } from 'mobx';

class Core {
  constructor() {
    makeAutoObservable(this);
  }

  running = false;
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
}

export const store = new Core();