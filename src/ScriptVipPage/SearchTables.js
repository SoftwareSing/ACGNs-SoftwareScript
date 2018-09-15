import { getLocalCompanies } from 'functions/getLocalCompanies';
import { alertDialog } from 'require';
import { debugConsole } from 'functions/debugConsole';
import { stripscript } from 'functions/stripscript';

/**
 * 操縱搜尋表的物件
 */
export class SearchTables {
  constructor() {
    this.tables = [];
    this.loadFromLocalstorage();
  }

  updateToLocalstorage() {
    window.localStorage.setItem('localSearchTables', JSON.stringify(this.tables));
  }
  loadFromLocalstorage() {
    this.tables = JSON.parse(window.localStorage.getItem('localSearchTables')) || [];
    if (this.tables.length < 1) {
      this.updateToLocalstorage();
    }
  }

  /**
   * 會刪除所有table, 同時清空localStorage裡table的資料
   * @return {void}
   */
  deleteAllTable() {
    this.tables = [];
    window.localStorage.removeItem('localSearchTables');
  }


  /**
   * 輸出搜尋表的表頭
   * @param {String} tableName 目標的table名稱
   * @return {Array} table的表頭列
   */
  outputSearchTableHead(tableName) {
    const table = this.tables.find((t) => {
      return (t.tableName === tableName);
    });
    const outputArray = [];
    for (const column of table.column) {
      outputArray.push(column.columnName);
    }

    return outputArray;
  }
  /**
   * 輸出搜尋表的結果, 也就是tBody的內容
   * @param {String} tableName 目標的table名稱
   * @return {Array} tBody的內容
   */
  outputSearchResults(tableName) {
    console.log(`start outputSearchResults()`);

    const table = this.tables.find((t) => {
      return (t.tableName === tableName);
    });
    const localCompanies = getLocalCompanies();
    let outputCompanies = [];
    try {
      if (table.filter) {
        for (const company of localCompanies) {
          if (this.doInputFunction(company, table.filter)) {
            outputCompanies.push(company);
          }
        }
      }
      else {
        outputCompanies = localCompanies;
      }
    }
    catch (e) {
      alertDialog.alert('計算失敗！過濾公式出錯');

      return;
    }

    try {
      if (table.sort) {
        outputCompanies.sort((a, b) => {
          return (this.doInputFunction(b, table.sort) - this.doInputFunction(a, table.sort));
        });
      }
    }
    catch (e) {
      alertDialog.alert('計算失敗！排序公式出錯');

      return;
    }

    const outputList = [];
    let debugColumnName = '';
    try {
      for (const company of outputCompanies) {
        const row = [];
        for (const column of table.column) {
          debugColumnName = column.columnName;
          const pushValue = this.doInputFunction(company, column.rule);
          row.push(pushValue);
        }
        outputList.push(row);
      }
    }
    catch (e) {
      alertDialog.alert(`計算失敗！欄位 ${debugColumnName} 公式出錯`);

      return;
    }

    debugConsole(`outputList: `);
    debugConsole(outputList);
    console.log(`end outputSearchResults(), outputList.length: ${outputList.length}`);

    return outputList;
  }


  /**
   * 建立一個新的table
   * @param {String} newTableName table名
   * @return {void}
   */
  addTable(newTableName) {
    const tableName = stripscript(newTableName);
    const newTable = { 'tableName': tableName,
      'filter': null,
      'sort': null,
      'column': [] };
    const i = this.tables.findIndex((t) => {
      return (t.tableName === tableName);
    });
    if (i === -1) {
      this.tables.push(newTable);
    }
    else {
      this.tables[i] = newTable;
    }

    const companyLink = '(`<a name=\'companyName\' id=\'${ID}\' href=\'/company/detail/${ID}\'>${name}</a>`)';
    this.addTableColumn(tableName, '公司名稱', companyLink);
  }

  /**
   * 刪除指定的table
   * @param {String} tableName 目標的table名稱
   * @return {void}
   */
  deleteTable(tableName) {
    const i = this.tables.findIndex((t) => {
      return (t.tableName === tableName);
    });
    this.tables.splice(i, 1);
  }


  addTableSort(tableName, sort) {
    const i = this.tables.findIndex((t) => {
      return (t.tableName === tableName);
    });
    this.tables[i].sort = sort;
  }
  deleteTableSort(tableName) {
    this.addTableSort(tableName, null);
  }


  addTableFilter(tableName, filter) {
    const i = this.tables.findIndex((t) => {
      return (t.tableName === tableName);
    });
    this.tables[i].filter = filter;
  }
  deleteTableFilter(tableName) {
    this.addTableFilter(tableName, null);
  }

  /**
   * 在table中增加一個欄位, 名稱重複會自動轉往changeTableColumn
   * @param {String} tableName 目標的table名稱
   * @param {String} columnName 指定的新欄位名稱
   * @param {String} rule 欄位的規則
   * @return {void}
   */
  addTableColumn(tableName, columnName, rule) {
    const i = this.tables.findIndex((d) => {
      return (d.tableName === tableName);
    });
    if (this.tables[i].column.findIndex((col) => {
      return (col.columnName === columnName);
    }) === -1) {
      this.tables[i].column.push({ 'columnName': stripscript(columnName), 'rule': rule });
    }
    else {
      this.changeTableColumn(tableName, { name: columnName, newName: columnName }, rule);
    }
  }

  /**
   * 改變欄位的 規則 或 名稱
   * @param {String} tableName 目標的table名稱
   * @param {{name: String, newName: String}} columnNames 目標的原名稱, 新名稱
   * @param {String} rule 目標的新規則
   * @return {void}
   */
  changeTableColumn(tableName, columnNames, rule) {
    const columnName = columnNames.name;
    const newColumnName = columnNames.newName || columnNames.name;

    const i = this.tables.findIndex((d) => {
      return (d.tableName === tableName);
    });
    const tableColumn = this.tables[i].column;
    const j = tableColumn.findIndex((col) => {
      return (col.columnName === columnName);
    });
    this.tables[i].column[j].rule = rule;
    this.tables[i].column[j].columnName = stripscript(newColumnName);
  }

  /**
   * 刪除指定的欄位
   * @param {String} tableName 目標的table名稱
   * @param {String} columnName 目標的column名稱
   * @return {void}
   */
  deleteTableColumn(tableName, columnName) {
    const i = this.tables.findIndex((d) => {
      return (d.tableName === tableName);
    });
    const tableColumn = this.tables[i].column;
    const j = tableColumn.findIndex((col) => {
      return (col.columnName === columnName);
    });
    this.tables[i].column.splice(j, 1);
  }


  /**
   * 執行輸入的function, function需以String傳入, 如: '() => employeesNumber > 0'
   * @param {Company} company 輸入的company
   * @param {String} fun 運算的function
   * @return {funReturn} 執行後的回傳值
   */
  doInputFunction(company, fun) {
    /* eslint-disable no-eval, no-unused-vars */
    const ID = company.companyId;
    const Id = company.companyId;
    const id = company.companyId;
    const name = company.name;
    const chairman = company.chairman || '';
    const manager = company.manager || '';

    const grade = company.grade;
    const capital = company.capital;
    const price = company.price;
    const stock = company.release;
    const release = company.release;
    const profit = company.profit;

    const vipBonusStocks = company.vipBonusStocks;
    const managerProfitPercent = company.managerBonusRatePercent;
    const managerBonusRatePercent = company.managerBonusRatePercent;
    const capitalIncreaseRatePercent = company.capitalIncreaseRatePercent;

    const salary = company.salary;
    const nextSeasonSalary = company.nextSeasonSalary;
    const bonus = company.employeeBonusRatePercent;
    const employeeBonusRatePercent = company.employeeBonusRatePercent;
    const employeesNumber = company.employeesNumber;
    const nextSeasonEmployeesNumber = company.nextSeasonEmployeesNumber;

    const tags = company.tags || [];
    const createdAt = company.createdAt;

    debugConsole('=====do=' + fun);

    return eval(fun);
    /* eslint-enable no-eval, no-unused-vars */
  }

  outputTable(tableName) {
    console.log('start outputTable()');

    this.loadFromLocalstorage();

    const t = this.tables.find((x) => {
      return x.tableName === tableName;
    });
    const localCompanies = getLocalCompanies();
    let outputCompanies = [];
    try {
      if (t.filter) {
        for (const c of localCompanies) {
          if (this.doInputFunction(c, t.filter)) {
            outputCompanies.push(c);
          }
        }
      }
      else {
        outputCompanies = localCompanies;
      }
    }
    catch (e) {
      alertDialog.alert('計算失敗！過濾公式出錯');

      return;
    }

    try {
      if (t.sort) {
        outputCompanies.sort((a, b) => {
          return this.doInputFunction(b, t.sort) - this.doInputFunction(a, t.sort);
        });
      }
    }
    catch (e) {
      alertDialog.alert('計算失敗！排序公式出錯');

      return;
    }

    const outputList = [];
    let debugColumnName = '';
    try {
      for (const c of outputCompanies) {
        const row = {};
        for (const column of t.column) {
          debugColumnName = column.columnName;
          row[column.columnName] = this.doInputFunction(c, column.rule);
        }
        outputList.push(row);
      }
    }
    catch (e) {
      alertDialog.alert(`計算失敗！欄位 ${debugColumnName} 公式出錯`);

      return;
    }


    // 需要重整，應該歸類到View裡面
    let thead = '';
    for (const column of t.column) {
      thead += `<th style='max-width: 390px;'>${column.columnName}</th>`;
    }
    const output = (`
        <table border='1' name='outputTable'>
            <thead name='outputTable'>
                ${thead}
            </thead>
            <tbody name='outputTable'>
            </tbody>
        </table>
    `);
    ($(`p[name='outputTable']`)).append(output);
    for (const row of outputList) {
      let outputRow = `<tr>`;
      for (const column of t.column) {
        outputRow += `<td style='max-width: 390px;'>${row[column.columnName]}</td>`;
      }
      outputRow += `</tr>`;
      $(`tbody[name='outputTable']`).append(outputRow);
    }

    console.log('end outputTable()');
  }
}
