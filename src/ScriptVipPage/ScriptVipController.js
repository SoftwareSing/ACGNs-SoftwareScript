import { EventController } from 'Global/EventController';
import { stripscript } from 'functions/stripscript';
import { ScriptVipView } from 'ScriptVipPage/ScriptVipView';
import { SearchTables } from 'ScriptVipPage/SearchTables';

/**
 * ScriptVip頁面的Controller
 */
export class ScriptVipController extends EventController {
  /**
   * 建構ScriptVipController
   * @param {LoginUser} loginUser 登入中的使用者
   */
  constructor(loginUser) {
    super('ScriptVipController', loginUser);
    this.searchTables = new SearchTables();
    this.scriptVipView = new ScriptVipView(this);

    Template.softwareScriptVip.onRendered(() => {
      this.scriptVipView.displayScriptVipProducts(this.loginUser);
      this.scriptVipView.displayScriptAdInfo(this.loginUser);
      this.scriptVipView.displaySearchTables(this.loginUser);
    });
  }

  deleteLocalSearchTables() {
    this.searchTables.deleteAllTable();
    this.searchTables.updateToLocalstorage();
    //有些錯誤會造成addEventListener加入失敗，因此直接重載入網頁
    setTimeout(() => {
      FlowRouter.go('blankPage');
      setTimeout(() => {
        FlowRouter.go('softwareScriptVip');
      }, 10);
    }, 0);
  }

  createNewSearchTable(newTableName) {
    this.searchTables.loadFromLocalstorage();
    this.searchTables.addTable(newTableName);
    this.searchTables.updateToLocalstorage();

    this.scriptVipView.displaySearchTablesList();
    $(`select[name='dataSearchList']`)[0].value = stripscript(newTableName);
    this.scriptVipView.displaySearchTableInfo();
  }
  deleteSearchTable(tableName) {
    this.searchTables.loadFromLocalstorage();
    this.searchTables.deleteTable(tableName);
    this.searchTables.updateToLocalstorage();

    this.scriptVipView.displaySearchTablesList();
    this.scriptVipView.displaySearchTableInfo();
  }

  addSearchTableFilter(tableName, filter) {
    this.searchTables.loadFromLocalstorage();
    this.searchTables.addTableFilter(tableName, filter);
    this.searchTables.updateToLocalstorage();
  }
  deleteSearchTableFilter(tableName) {
    this.searchTables.loadFromLocalstorage();
    this.searchTables.deleteTableFilter(tableName);
    this.searchTables.updateToLocalstorage();
  }

  addSearchTableSort(tableName, sort) {
    this.searchTables.loadFromLocalstorage();
    this.searchTables.addTableSort(tableName, sort);
    this.searchTables.updateToLocalstorage();
  }
  deleteSearchTableSort(tableName) {
    this.searchTables.loadFromLocalstorage();
    this.searchTables.deleteTableSort(tableName);
    this.searchTables.updateToLocalstorage();
  }

  addSearchTableColumn(tableName, newName, newRule) {
    this.searchTables.loadFromLocalstorage();
    this.searchTables.addTableColumn(tableName, newName, newRule);
    this.searchTables.updateToLocalstorage();
  }
  changeSearchTableColumn(tableName, columnNames, newRule) {
    this.searchTables.loadFromLocalstorage();
    this.searchTables.changeTableColumn(tableName, columnNames, newRule);
    this.searchTables.updateToLocalstorage();
  }
  deleteSearchTableColumn(tableName, columnName) {
    this.searchTables.loadFromLocalstorage();
    this.searchTables.deleteTableColumn(tableName, columnName);
    this.searchTables.updateToLocalstorage();
  }
}
