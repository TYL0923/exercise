const fs = require('fs');
const mammoth = require('mammoth');
// const prefixPath = 'upload'

function isExist(dirName: string) {
  return new Promise((resolve) => {
    fs.stat(dirName, function (err, stats) {
      if (!stats) {
        fs.mkdir(dirName, { recursive: true }, (err) => {
          if (!err) return resolve(true);
          else return resolve(false);
        });
      } else return resolve(true);
    });
  });
}
export function save(path: string, file: any): Promise<string> {
  return new Promise(async (resolve, reject) => {
    await isExist(path);
    const name = `${Date.now().toString()}.${file.originalname
      .split('.')
      .pop()}`;
    fs.writeFile(`${path}/${name}`, file.buffer, (err) => {
      if (err) reject(err);
      else resolve(name);
    });
  });
}
export function extract<T extends 'txt' | 'docx'>(
  path: string,
  name: string,
  type: T,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const handle: Record<'txt' | 'docx', (name: string) => void> = {
      txt: (name: string) => {
        fs.readFile(`${path}/${name}`, 'utf8', (err, data) => {
          if (!err) resolve(data);
          else reject(new Error('读取文件失败'));
        });
      },
      docx: (name: string) => {
        mammoth
          .extractRawText({ path: `upload/${name}` })
          .then((result) => {
            resolve(result.value);
          })
          .catch(() => reject(new Error('读取文件失败')))
          .done();
      },
    };
    handle[type](name);
  });
}
export function remove(path: string, name: string) {
  fs.unlinkSync(`${path}/${name}`);
}
