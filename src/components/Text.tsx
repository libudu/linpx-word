import { useTextAnimeRef } from '@/utils/animeHooks';
import React, { useEffect, useState } from 'react';
import { parseDocument } from 'htmlparser2';
import { store } from '@/store';

const CPS = 30;

const Text: React.FC<{
  text: string;
  onAnimateEnd: () => void;
}> = ({ text, onAnimateEnd }) => {
  const ref = useTextAnimeRef();
  const [children, setChildren] = useState<JSX.Element[]>();
  useEffect(() => {
    const { children } = parseDocument(text);
    // 递归处理每个节点
    let count = 0;
    const processNodeList = (nodeList: any[]) => {
      const result: any[] = [];
      nodeList.forEach(({ type, data, children, attribs }, index) => {
        if(type === 'tag') {
          const childResult = processNodeList(children);
          let style: React.CSSProperties = {};
          // 处理文本标签
          if(attribs['i'] != undefined) style['fontStyle'] = 'italic';
          if(attribs['b'] != undefined || attribs['bold'] != undefined) style['fontWeight'] = 'bold';
          if(attribs['color'] != undefined) style['color'] = attribs['color'];
          result.push(<span key={index} style={style}>{childResult}</span>)
        } else {
          // 统计有效字数
          count += data.length;
          result.push(<span key={index}>{data}</span>)
        }
      });
      return result;
    };
    const result = processNodeList(children);
    setChildren(result);

    const { runningMode } = store;
    // 显示之后延迟500ms动画时间 + 100ms基础时间 + 文字/每秒阅读字数时间
    let delay = 600 + count / CPS * 1000;
    if(runningMode == 'dev') {
      delay /= 3;
    }
    const timer = setTimeout(() => {
      onAnimateEnd();
    }, delay);
    // 组件卸载时取消定时器
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div ref={ref} className='opacity-0'>
      { children }
    </div>
  )
};

export default Text;