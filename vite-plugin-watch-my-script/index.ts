import fs from 'fs';
import BabelPulginAutoAwait from 'babel-plugin-auto-await';
import { transformAsync } from '@babel/core';
import chokidar from 'chokidar';

export default function () {
  let chokidarInstance = null;

  return {
    name: 'watch-my-script',
    buildStart: () => {
      if(chokidarInstance == null) {
        chokidarInstance = chokidar.watch('./src/static/scripts').on("change", async (path) => {
          // 读取脚本并处理
          const script = fs.readFileSync(path).toString();
          const wrapperScript = `(async () => {\n${script}\n})();`;
          const { code } = await transformAsync(wrapperScript, { plugins: [ BabelPulginAutoAwait ] });
          let outputPath = path.replace('scripts', 'scripts_build');
          outputPath = outputPath.slice(0, outputPath.length - 3) + '.js';
          fs.writeFileSync(outputPath, code);
          console.log('更新文件:', path);
        });
      }
    },
  };
};