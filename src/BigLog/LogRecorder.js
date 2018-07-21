import { dbLog } from 'require';

/**
 * 用於紀錄所有log
 */
export class LogRecorder {
  //Singleton
  constructor() {
    if (! LogRecorder.instance) {
      LogRecorder.instance = this;
      this.localLog = [];
      this.meteorLog = Meteor.connection._mongo_livedata_collections.log;
      console.log(`create LogRecorder`);
    }

    return LogRecorder.instance;
  }
  static get instance() {
    return this._instance;
  }
  static set instance(input) {
    this._instance = input;
  }

  isAlreadyExists(list, log) {
    const old = list.find((x) => {
      return (x._id._str === log._id._str);
    });
    if (old !== undefined) {
      return true;
    }
    else {
      return false;
    }
  }
  /**
   * 回傳過濾過的log
   * @param {String} att 用於過濾的屬性
   * @param {String} value 符合的值, 通常是字串
   * @return {Array} 過濾後的log
   */
  find(att, value) {
    let list = [];
    if (att !== undefined && value !== undefined) {
      list = this.localLog.filter((x) => {
        return (x[att] === value);
      });
    }
    else {
      list = this.localLog;
    }

    return list;
  }
  /**
   * 回傳過濾後的log
   * @param {Funstion} fun 用於過濾的函式
   * @return {Array} 過濾後的log
   */
  filter(fun) {
    let list = [];
    if (typeof fun === 'function') {
      list = this.localLog.filter(fun);
    }
    else {
      list = this.localLog;
    }

    return list;
  }
  push(serverLog) {
    for (const log of serverLog) {
      if (! this.isAlreadyExists(this.localLog, log)) {
        log.softwareScriptStamp = true;
        this.localLog.push(log);
      }
    }
  }
  recordServerLog() {
    const serverLog = dbLog.find().fetch();
    this.push(serverLog);
  }

  /**
   * 依照時間排序並回傳, 未輸入陣列則以目前記錄的log去排序
   * @param {Array} list 要排序的陣列
   * @return {Array} 排序完的陣列
   */
  sort(list) {
    if (! list) {
      list = this.localLog;
    }
    list.sort((a, b) => {
      return (b.createdAt.getTime() - a.createdAt.getTime());
    });

    return list;
  }
}
