import { dbCompanies, dbEmployees } from 'require';
import { Company } from 'Company/Company';
import { getLocalCompanies } from 'functions/getLocalCompanies';
import { earnPerShare } from 'functions/earnPerShare';
import { effectiveStocks } from 'functions/effectiveStocks';

/**
 * Company的集合，會創建多個company放在裡面
 */
export class Companies {
  constructor() {
    this.list = [];
    let serverCompanies;
    const page = FlowRouter.getRouteName();
    if (page === 'companyDetail') {
      const detailId = FlowRouter.getParam('companyId');
      serverCompanies = dbCompanies.find({ _id: detailId}).fetch();
    }
    else {
      serverCompanies = dbCompanies.find().fetch();
    }
    for (const serverCompany of serverCompanies) {
      const company = new Company(serverCompany);
      this.list.push(company);
    }
  }

  companyPatch() {
    const localCompanies = getLocalCompanies();
    this.list.forEach((company, i, list) => {
      const companyData = localCompanies.find((x) => {
        return (x.companyId === company.companyId);
      });
      if (companyData !== undefined) {
        list[i].updateWithLocalcompanies(companyData);
      }
      else {
        list[i].updateWithLocalcompanies({
          companyId: company.companyId,
          name: company.name,
          chairman: company.chairman,
          manager: company.manager,

          grade: 'D',
          capital: company.capital,
          price: company.price,
          release: company.release,
          profit: company.profit,

          vipBonusStocks: 0, //外掛獨有參數
          managerBonusRatePercent: company.managerBonusRatePercent,
          capitalIncreaseRatePercent: company.capitalIncreaseRatePercent,

          salary: 1000,
          nextSeasonSalary: 1000,
          employeeBonusRatePercent: company.employeeBonusRatePercent,
          employeesNumber: 0,
          nextSeasonEmployeesNumber: 0,

          tags: [],
          createdAt: company.createdAt
        });
      }
    });
  }

  updateEmployeesInfo() {
    console.log(`---start updateEmployeesInfo()`);

    this.list.forEach((company, i, list) => {
      const serverEmployees = dbEmployees.find({ companyId: company.companyId }).fetch();
      list[i].updateWithDbemployees(serverEmployees);
    });

    console.log(`---end updateEmployeesInfo()`);
  }

  updateToLocalstorage() {
    const localCompanies = getLocalCompanies();
    for (const company of this.list) {
      const i = localCompanies.findIndex((x) => {
        return (x.companyId === company.companyId);
      });
      const inputData = company.outputInfo();
      if (i !== -1) {
        localCompanies[i] = inputData;
      }
      else {
        localCompanies.push(inputData);
      }
    }

    window.localStorage.setItem('localCompanies', JSON.stringify(localCompanies));
  }

  /**
   * 尋找特定公司
   * 找不到時回傳undefined
   * @param {String} companyId company的ID
   * @return {Company} 找到的公司
   */
  find(companyId) {
    for (const company of this.list) {
      if (company.companyId === companyId) {
        return company;
      }
    }

    return undefined;
  }


  computeUserProfit(loginUser) {
    let userProfit = 0;
    for (const company of this.list) {
      const userHold = loginUser.holdStocks.find((x) => {
        return (x.companyId === company.companyId);
      });
      if (userHold !== undefined) {
        userProfit += earnPerShare(company.outputInfo()) * effectiveStocks(userHold.stocks, userHold.vip);
      }
    }

    return userProfit;
  }
}
