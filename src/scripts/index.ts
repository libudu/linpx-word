import { emitter, SIGNAL } from './api';
import TestScript from '@/static/scripts_build/test.js?raw';

interface LoadScriptProps {
  onText: (text: string) => void,
}

export const loadScript = ({ onText }: LoadScriptProps) => {
  // 初始化事件监听器
  emitter.on(SIGNAL.TEXT, onText);
  // 加载脚本
  return eval(TestScript);
};