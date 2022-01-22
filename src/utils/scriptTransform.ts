import { registerPlugin, transform } from '@babel/standalone';
// 仅导出类型，避免babel无法直接打包到前端
import { PluginItem, types as BabelTypes } from '@babel/core';
import { StringLiteral } from '@babel/types';

// 编译linpx-word脚本的Babel插件
const getLinpxWordScriptBabelPlugin: (types: typeof BabelTypes) => PluginItem = (types) => {
  return {
    visitor: {
      // 函数声明都改成异步函数
      FunctionDeclaration: (path) => {
        path.node.async = true;
      },
      // 给所有函数调用加上await
      Function: (path) => {
        path.traverse({
          CallExpression: function (path) {
            if (path.parent.type !== 'AwaitExpression') {
              path.replaceWith(types.awaitExpression(path.node))
            }
          },
        })
      },
      // 将表达式中的字符串字面量转换为text函数调用
      ExpressionStatement: (path) => {
        const expression = path.node.expression as StringLiteral;
        if(types.isStringLiteral(expression)) {
          const value = expression.value ;
          const newExpression = types.callExpression(types.identifier("text"), [types.stringLiteral(value)]);
          path.node.expression = types.awaitExpression(newExpression);
        }
      }
    }
  };
};

// 注册到babel/standalone中，之后就可以用了
registerPlugin('linpx-word-script', (o: any): PluginItem => {
  const types = o.types;
  return getLinpxWordScriptBabelPlugin(types);
});

export default (rowScript: string) => {
  // 整体异步包裹
  const wrapperScript = `(async () => {
    // 避免将第一句字符串字面量视为函数指令
    true;
    ${rowScript}
  })();`;

  // 代码转换
  const result = transform(wrapperScript, {
    plugins: [
      'linpx-word-script'
    ]
  });
  return result?.code;
};