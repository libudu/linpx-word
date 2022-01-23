// @ts-ignore
import fs from 'fs';
import chokidar from 'chokidar';
import transform from '../src/scripts/transform';

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
          const code = transform(script);

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