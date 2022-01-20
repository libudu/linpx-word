import { globalText } from './Global/text';

declare global {
  const text: typeof globalText;
}

(window as any).text = globalText;