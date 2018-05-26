export class AccessedRecorder {
  constructor(dbName, number = 20, interval = 60000) {
    this.name = dbName;
    this.number = number;
    this.interval = interval;
    this.records = [];
  }

  addRecord() {
    this.records.push(Date.now());
  }

  getAccessedCount() {
    this.records = this.records.filter((t) => {
      return (Date.now() - t) < this.interval;
    });
    this.records.sort((a, b) => {
      return a - b; //由小至大
    });

    return {count: this.records.length, firstTime: this.records[0]};
  }

  getWarningInfo() {
    let shouldWarning = false;
    const { count, firstTime } = this.getAccessedCount();
    const warningNumber = (this.number - 5) > 5 ? this.number - 5 : this.number - 1;
    if (warningNumber < 3) {
      //只能操作不到3次的動作不提醒
      return {shouldWarning: false, count: count, firstTime: firstTime};
    }

    if (count >= warningNumber) {
      shouldWarning = true;
    }

    return {shouldWarning: shouldWarning, count: count, firstTime: firstTime};
  }
}
