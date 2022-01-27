import { getFileSystem } from 'browserfs';
import { FileFlag } from 'browserfs/dist/node/core/file_flag';
import { FileSystem } from 'browserfs/dist/node/core/file_system';

export const TEMP_FILE_NAME = '/temp.txt';

let fs: FileSystem;
await new Promise((resolve) => {
  getFileSystem({
    fs: 'LocalStorage',
    options: {},
  }, (e, fileSystem) => {
    if(e) {
      console.log(e)
    }
    if(fileSystem) {
      fs = fileSystem;
      resolve(null);
    }
  })
});

export const fileApi = {
  write: async (path: string, content: string) => {
    fs.writeFileSync(path, content, null, FileFlag.getFileFlag('w+'), 0);
  },
  read: async (path: string) => {
    try {
      const bytes: Uint8Array = fs.readFileSync(path, null, FileFlag.getFileFlag('r'));
      return bytes.toString();
    } catch (e) {
      return '';
    }
  },
};