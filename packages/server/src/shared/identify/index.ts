const fs = require('fs');
const mammoth = require('mammoth');
const prefixPath = 'upload';
export function save(file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const name = `${Date.now().toString()}.${file.originalname
      .split('.')
      .pop()}`;
    fs.writeFile(`${prefixPath}/${name}`, file.buffer, (err) => {
      if (err) {
        reject();
      } else resolve(name);
    });
  });
}
export function extract<T extends 'txt' | 'docx'>(
  name: string,
  type: T,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const handle: Record<'txt' | 'docx', (name: string) => void> = {
      txt: (name: string) => {
        fs.readFile(`${prefixPath}/${name}`, 'utf8', (err, data) => {
          if (!err) resolve(data);
          else reject();
        });
      },
      docx: (name: string) => {
        mammoth
          .extractRawText({ path: `upload/${name}` })
          .then(function (result) {
            resolve(result.value);
          })
          .catch(() => reject())
          .done();
      },
    };
    handle[type](name);
  });
}
export function remove(name: string) {
  fs.unlinkSync(`${prefixPath}/${name}`);
}
