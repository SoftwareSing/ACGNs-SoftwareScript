/**
 * CompanyObject
 */
export class Company {
  /**
   * 建構 Company
   * @param {object} serverCompany 從dbCompanies中擷取出來的單一個company
   */
  constructor(serverCompany) {
    this.companyId = serverCompany._id;
    this.name = serverCompany.companyName;

    this.chairman = serverCompany.chairman || '';
    this.manager = serverCompany.manager || '';

    this.grade = serverCompany.grade;
    this.capital = serverCompany.capital;
    this.price = serverCompany.listPrice;
    this.release = serverCompany.totalRelease;
    this.profit = serverCompany.profit;

    this.vipBonusStocks = 0; //外掛獨有參數
    this.managerBonusRatePercent = serverCompany.managerBonusRatePercent;
    this.capitalIncreaseRatePercent = serverCompany.capitalIncreaseRatePercent;

    this.salary = serverCompany.salary || 1000;
    this.nextSeasonSalary = serverCompany.nextSeasonSalary || 1000;
    this.employeeBonusRatePercent = serverCompany.employeeBonusRatePercent;
    this.employeesNumber = 0;
    this.nextSeasonEmployeesNumber = 0;

    this.tags = serverCompany.tags || [];
    this.createdAt = serverCompany.createdAt.getTime();
  }

  updateWithDbemployees(serverEmployees) {
    console.log(`---start updateWithDbemployees()`);

    let employeesNumber = 0;
    let nextSeasonEmployeesNumber = 0;

    for (const emp of serverEmployees) {
      if ((emp.employed === true) && (emp.resigned === false)) {
        employeesNumber += 1;
      }
      else if ((emp.employed === false) && (emp.resigned === false)) {
        nextSeasonEmployeesNumber += 1;
      }
    }

    this.employeesNumber = employeesNumber;
    this.nextSeasonEmployeesNumber = nextSeasonEmployeesNumber;

    console.log(`---end updateWithDbemployees()`);
  }

  /**
   * 會判斷是不是在companyDetail頁面, 是的話就只取vipBonusStocks用, 不放入其他參數
   * @param {Company} companyData 公司資料
   * @return {void}
   */
  updateWithLocalcompanies(companyData) {
    this.vipBonusStocks = companyData.vipBonusStocks; //外掛獨有參數
    const page = FlowRouter.getRouteName();
    if (page !== 'companyDetail') {
      this.grade = companyData.grade;

      this.salary = companyData.salary;
      this.nextSeasonSalary = companyData.nextSeasonSalary;
      this.employeesNumber = companyData.employeesNumber;
      this.nextSeasonEmployeesNumber = companyData.nextSeasonEmployeesNumber;

      this.tags = companyData.tags;
    }
  }

  computePERatio() {
    return ((this.price * this.release) / (this.profit));
  }

  computePERatioWithVipSystem() {
    return ((this.price * (this.release + this.vipBonusStocks)) / (this.profit));
  }

  outputInfo() {
    return {
      companyId: this.companyId,
      name: this.name,
      chairman: this.chairman,
      manager: this.manager,

      grade: this.grade,
      capital: this.capital,
      price: this.price,
      release: this.release,
      profit: this.profit,

      vipBonusStocks: this.vipBonusStocks, //外掛獨有參數
      managerBonusRatePercent: this.managerBonusRatePercent,
      capitalIncreaseRatePercent: this.capitalIncreaseRatePercent,

      salary: this.salary,
      nextSeasonSalary: this.nextSeasonSalary,
      employeeBonusRatePercent: this.employeeBonusRatePercent,
      employeesNumber: this.employeesNumber,
      nextSeasonEmployeesNumber: this.nextSeasonEmployeesNumber,

      tags: this.tags,
      createdAt: this.createdAt
    };
  }
}
