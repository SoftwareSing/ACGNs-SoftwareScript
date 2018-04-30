/**
 * 過濾字串
 * @param {String} s 被過濾的字串
 * @return {String} 過濾完的字串
 */
export function stripscript(s) {
  const pattern = new RegExp(`[\`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]`);
  let rs = '';
  for (let i = 0; i < s.length; i += 1) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }

  return rs;
}
