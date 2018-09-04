const fs = require('fs');
const getVersion = require('./version.js');

const srcDirPath = './src/';
const mainFilePath = 'main'; // 從 srcDirPath 底下開始尋找
const outputFilePath = './ACGNs-SoftwareScript.user.js';

const debugMode = false;
function debugConsole(...messages) {
  if (debugMode) {
    console.log(...messages);
  }
}


let writeCount = -1;
function copyJsFile(filePath) {
  writeCount += 1;
  let dashLine = '';
  for (let i = 0; i < writeCount; i += 1) {
    dashLine += '-';
  }
  fs.writeSync(outputFile, `//${dashLine}start file: ${filePath}\n`);
  analyzeFileAndOutput(filePath);
  fs.writeSync(outputFile, `//${dashLine}end file: ${filePath}\n`);
  fs.writeSync(outputFile, `//\n`);
  writeCount -= 1;
}

function analyzeFileAndOutput(filePath) {
  const lines = fs.readFileSync(srcDirPath + filePath + '.js', 'utf8').split('\n');
  for (const line of lines) {
    debugConsole(line);
    if (isStartWith('import ', line)) {
      importFile(line);
    }
    else if (isStartWith('// @version', line)) {
      fs.writeSync(outputFile, `// @version      ${getVersion()}\n`);
    }
    else if (isStartWith('export ', line)) {
      fs.writeSync(outputFile, line.slice(7) + '\n');
    }
    else {
      fs.writeSync(outputFile, line + '\n');
    }
  }
}

function isStartWith(regexp, line) {
  return line.search(regexp) === 0;
}

const importList = [];
function importFile(line) {
  const filePath = findImportPath(line);
  const isImported = importList.find((imported) => {
    return imported === filePath;
  });

  if (! isImported) {
    debugConsole(`//new import: ${filePath}`);
    importList.push(filePath);
    copyJsFile(filePath);
  }
  else {
    debugConsole(`//import already exists`);
  }
}

function findImportPath(line) {
  const start = line.search(/from '/) + 6;
  const end = line.search(/';/);
  const path = line.slice(start, end);

  return path;
}


const outputFile = fs.openSync(outputFilePath, 'w');
fs.writeSync(outputFile, '/* 本檔由 mergeFile.js 自動產生, 欲修改code請至src資料夾 */\n');
copyJsFile(mainFilePath);
fs.closeSync(outputFile);

console.log('');
console.log('merge file done.');
