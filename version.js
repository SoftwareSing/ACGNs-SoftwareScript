module.exports = function getVersion() { // eslint-disable-line no-undef
  return `${majorVersion}.${fixNumber(minorVersion)}.${fixNumber(bugFixVersion)}`;
};

function fixNumber(number) {
  const numberLength = 2; // 數字長度 ex: 01
  let str = String(number);
  while (str.length < numberLength) {
    str = '0' + str;
  }

  return str;
}

// 從版本 5.14.00 以後開始紀錄version
let majorVersion = 5; // eslint-disable-line prefer-const
let minorVersion = 14; // eslint-disable-line prefer-const
let bugFixVersion = 0; // eslint-disable-line prefer-const

// ------ 由此開始寫 version 變化 ------
bugFixVersion += 1; // 簡化 關於 頁面的內容
bugFixVersion += 1; // 更精準的判斷廣告是否正常顯示

// 修正 大量紀錄 無法使用的問題
minorVersion += 1;
bugFixVersion = 0;

// 修正 大量紀錄、資股資訊總表 無法使用的問題
// 修正 斷線提醒器 噴錯的問題
minorVersion += 1;
bugFixVersion = 0;
