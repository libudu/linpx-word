// @ts-ignore
import fs from 'fs';
import { transformAsync, types } from '@babel/core';
import chokidar from 'chokidar';

const WATCH_DIR = './scripts';
const OUTPUT_DIR = './scripts/build';

export default function () {
  let chokidarInstance = null;

  return {
    name: 'watch-my-script',
    buildStart: () => {
      if(chokidarInstance == null) {
        // 检测脚本目录下的文件
        chokidarInstance = chokidar.watch(WATCH_DIR).on("change", async (path) => {
          // 只处理ts文件
          if(path.slice(-2) != 'ts') {
            return;
          }

          const script = fs.readFileSync(path).toString();
          // 整体异步包裹
          const wrapperScript = `(async () => {
            // 避免将第一句字符串字面量视为函数指令
            true;
            ${script}
          })();`;

          // 代码转换
          const { code } = await transformAsync(wrapperScript, {
            plugins: [
              {
                visitor: {
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
                    const expression = path.node.expression;
                    if(types.isStringLiteral(expression)) {
                      const value = expression.value;
                      const newExpression = types.callExpression(types.identifier("text"), [types.stringLiteral(value)]);
                      path.node.expression = types.awaitExpression(newExpression);
                    }
                  }
                }
              },
            ]
          });

          // 输出到指定目录
          const fileName = path.split('\\').slice(-1)[0];
          const outputPath = OUTPUT_DIR + '/' + fileName.slice(0, -3) + '.js';
          fs.writeFileSync(outputPath, code);
          console.log('更新文件:', path);
        });
      }
    },
  };
};