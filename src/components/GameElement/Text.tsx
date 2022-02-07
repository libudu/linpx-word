import { useTextAnimeRef } from '@/utils/animeHooks';
import React, { useEffect, useState } from 'react';
import { parseDocument } from 'htmlparser2';
import { store } from '@/store';
import TextSpan from './TextSpan';
import classNames from 'classnames';

const CPS = 30;

const textTagList: {
  attr: string;
  style?: {
    key?: string;
    value?: string;
  };
  map?: (props: { attrValue: string }) => { styleKey: string; styleValue: string },
}[] = [
  // 斜体
  {
    attr: 'i',
    style: {
      key: 'fontStyle',
      value: 'italic',
    },
  },
  // 粗体
  {
    attr: 'b',
    style: {
      key: 'fontWeight',
      value: 'bold',
    },
  },
  {
    attr: 'bold',
    style: {
      key: 'fontWeight',
      value: 'bold',
    },
  },
  // 颜色
  {
    attr: 'color',
    style: {
      key: 'color',
    },
  },
  // 外框
  {
    attr: 'outline',
    style: {
      key: 'WebkitTextStroke',
    },
  },
  // 阴影
  {
    attr: 'shadow',
    style: {
      key: 'textShadow'
    },
  },
  // 深的阴影
  {
    attr: 'shadow-deep',
    map: ({ attrValue }) => {
      // example: 1px 1px 4px white
      const partList = attrValue.split(' ').filter(e => e);
      const styleValue = [['', ''], ['-', ''], ['', '-'], ['-', '-']].map(([x, y]) => {
        return `${x}${partList[0]} ${y}${partList[1]} ${partList.slice(2).join(' ')}`
      }).join(',');
      return {
        styleKey: 'textShadow',
        styleValue,
      };
    },
  },
];

const processText = (text: string) => {
  const { children } = parseDocument(text);
  // 递归处理每个节点
  let count = 0;
  const processNodeList = (nodeList: any[]) => {
    const result: JSX.Element[] = [];
    nodeList.forEach(({ type, data, children, attribs }, index) => {
      if(type === 'tag') {
        let eleStyle: React.CSSProperties = {};
        const childResult = processNodeList(children);
        // 处理文本标签
        textTagList.forEach(({ attr, style, map }) => {
          // 不存在属性
          if(attribs[attr] == undefined) {
            return;
          }
          // 存在映射关系
          if(map) {
            const { styleKey, styleValue } = map({ attrValue: attribs[attr] });
            eleStyle[styleKey] = styleValue;
            return;
          }
          // 以style的key和value优先，没有则用attr的
          const key = style?.key || attr;
          const value = style?.value || attribs[attr];
          eleStyle[key] = value;
        });
        result.push(
          <TextSpan
            key={index}
            style={eleStyle}
            shake={attribs['shake'] != undefined}
            glow={attribs['glow']}
          >
            { childResult }
          </TextSpan>
        );
      } else {
        // 统计有效字数
        count += data.length;
        result.push(<span key={index}>{data}</span>)
      }
    });
    return result;
  };
  const result = processNodeList(children);
  return {
    count,
    result,
  }
};

const Text: React.FC<{
  name?: string;
  content: string;
  className?: string;
  style?: React.CSSProperties;
  onAnimateEnd?: () => void;
}> = ({ name, content, style,  onAnimateEnd, className }) => {
  const ref = useTextAnimeRef();
  const [nameEle, setNameEle] = useState<JSX.Element[]>();
  const [children, setChildren] = useState<JSX.Element[]>();
  useEffect(() => {
    const { result, count } = processText(content);
    setChildren(result);
    const { result: nameResult } = processText(name);
    setNameEle(nameResult);

    const { runningMode } = store;
    // 显示之后延迟500ms动画时间 + 100ms基础时间 + 文字/每秒阅读字数时间
    let delay = 600 + count / CPS * 1000;
    if(runningMode == 'dev') {
      delay /= 3;
    }
    const timer = setTimeout(() => {
      onAnimateEnd && onAnimateEnd();
    }, delay);
    // 组件卸载时取消定时器
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div ref={ref} className={classNames('opacity-0 flex', className)} style={style}>
      {
        name &&
        <div className='mr-2 w-16 flex-shrink-0'>
          { nameEle }
        </div>
      }
      <div className='flex-wrap' style={{ 'overflowWrap': 'anywhere' }}>
        { children }
      </div>
    </div>
  )
};

export default Text;