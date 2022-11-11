const CryptoJS = require('crypto-js');
const header = {
  typ: 'JWT',
  alg: 'HS256',
};
const key = '!^#^@!#';

interface IPayloadOptions {
  [propName: string]: string | number | IPayloadOptions;
}
export function generateToken(payload: IPayloadOptions): string {
  const headerBase64 = Buffer.from(JSON.stringify(header), 'utf-8').toString(
    'base64',
  );
  const payloadBase64 = Buffer.from(JSON.stringify(payload), 'utf-8').toString(
    'base64',
  );
  const signature = CryptoJS.HmacSHA256(headerBase64 + payloadBase64, key);
  return headerBase64 + '.' + payloadBase64 + '.' + signature;
}

export function validationToken(token: string): boolean {
  const tokenArr = token.split('.');
  if (tokenArr.length < 3) return false;
  return CryptoJS.HmacSHA256(tokenArr[0] + tokenArr[1], key).toString() ===
    tokenArr[2]
    ? true
    : false;
}
