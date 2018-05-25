export class AccessedRecorder {
  constructor(dbName) {
    this.name = dbName;
    this.records = [];
  }

  addRecord() {
    const time = new Date();
    this.records.push(time.getTime());
  }

  checkAccessedCount() {
    const time = new Date();
    this.records = this.records.filter((t) => {
      return (time.getTime() - t) < 60000;
    });
    this.records.sort((a, b) => {
      return b - a;
    });

    return {count: this.records.length, firstTime: this.records[0]};
  }
}
