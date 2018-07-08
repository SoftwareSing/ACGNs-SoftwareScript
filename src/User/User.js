import { dbDirectors, dbVips, dbCompanies, dbEmployees, getInitialVoteTicketCount, getCurrentSeason } from '../require';
import { debugConsole } from '../functions/debugConsole';
import { getLocalCompanies } from '../functions/getLocalCompanies';
import { earnPerShare } from '../functions/earnPerShare';
import { effectiveStocks } from '../functions/effectiveStocks';
import { computeTax } from '../functions/computeTax';

/**
 * 用於存放AccountInfo頁面中的user資訊
 */
export class User {
  /**
   * 建構 User
   * @param {String} id userId
   */
  constructor(id) {
    console.log(`create user: ${id}`);
    this.userId = id;
    this.name = '';
    this.holdStocks = [];
    this.managers = [];
    this.employee = '';
    this.money = 0;
    this.ticket = 0;

    const load = this.loadFromSessionstorage();
    if (! load) {
      this.saveToSessionstorage();
    }
    console.log('');
  }

  saveToSessionstorage() {
    console.log(`---start saveToSessionstorage()`);

    const sessionUsers = JSON.parse(window.sessionStorage.getItem('sessionUsers')) || [];
    const i = sessionUsers.findIndex((x) => {
      return x.userId === this.userId;
    });
    if (i !== -1) {
      //將session裡的資料更新
      sessionUsers[i] = {
        userId: this.userId,
        holdStocks: this.holdStocks,
        managers: this.managers,
        employee: this.employee,
        money: this.money,
        ticket: this.ticket
      };
    }
    else {
      //之前session裡沒有user資料，將資料丟入
      sessionUsers.push({
        userId: this.userId,
        holdStocks: this.holdStocks,
        managers: this.managers,
        employee: this.employee,
        money: this.money,
        ticket: this.ticket
      });
    }

    window.sessionStorage.setItem('sessionUsers', JSON.stringify(sessionUsers));

    console.log(`---end saveToSessionstorage()`);
  }
  loadFromSessionstorage() {
    console.log(`---start loadFromSessionstorage()`);

    const sessionUsers = JSON.parse(window.sessionStorage.getItem('sessionUsers')) || [];
    const sUser = sessionUsers.find((x) => {
      return x.userId === this.userId;
    });
    if (sUser !== undefined) {
      this.holdStocks = sUser.holdStocks;
      this.managers = sUser.managers;
      this.employee = sUser.employee;
      this.money = sUser.money;
      this.ticket = sUser.ticket;

      console.log(`---end loadFromSessionstorage(): true`);

      return true;
    }
    else {
      console.log(`-----loadFromSessionstorage(): not found user: ${this.userId}`);
      console.log(`-----if is not in creating user, it may be a BUG`);
      console.log(`---end loadFromSessionstorage(): false`);

      return false;
    }
  }

  updateHoldStocks() {
    console.log(`---start updateHoldStocks()`);

    this.loadFromSessionstorage();

    const serverDirectors = dbDirectors.find({ userId: this.userId }).fetch();
    let isChange = false;
    for (const c of serverDirectors) {
      const i = this.holdStocks.findIndex((x) => {
        return x.companyId === c.companyId;
      });
      if (i !== -1) {
        if (this.holdStocks[i].stocks !== c.stocks) {
          isChange = true;
          this.holdStocks[i].stocks = c.stocks;
        }
      }
      else {
        isChange = true;
        this.holdStocks.push({companyId: c.companyId, stocks: c.stocks, vip: null});
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateHoldStocks()`);
  }
  updateVips() {
    console.log(`---start updateVips()`);

    this.loadFromSessionstorage();

    let isChange = false;
    const serverVips = dbVips.find({ userId: this.userId }).fetch();
    for (const serverVip of serverVips) {
      const i = this.holdStocks.findIndex((x) => {
        return (x.companyId === serverVip.companyId);
      });
      if (i !== -1) {
        if (this.holdStocks[i].vip !== serverVip.level) {
          isChange = true;
          this.holdStocks[i].vip = serverVip.level;
        }
      }
      else {
        isChange = true;
        this.holdStocks.push({companyId: serverVip.companyId, stocks: 0, vip: serverVip.level});
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateVips()`);
  }
  updateManagers() {
    console.log(`---start updateManagers()`);

    this.loadFromSessionstorage();

    const serverCompanies = dbCompanies.find({ manager: this.userId }).fetch();
    let isChange = false;
    for (const c of serverCompanies) {
      if (this.managers.find((x) => {
        return (x.companyId === c._id);
      }) === undefined) {
        isChange = true;
        this.managers.push({companyId: c._id});
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateManagers()`);
  }
  updateEmployee() {
    console.log(`---start updateEmployee()`);

    this.loadFromSessionstorage();

    const serverEmployees = dbEmployees.find({ userId: this.userId }).fetch();
    let isChange = false;
    for (const emp of serverEmployees) {
      if (emp.employed) {
        if (this.employee !== emp.companyId) {
          isChange = true;
          this.employee = emp.companyId;
        }
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateEmployee()`);
  }
  updateUser() {
    console.log(`---start updateUser()`);

    this.loadFromSessionstorage();

    let isChange = false;
    const serverUsers = Meteor.users.find({ _id: this.userId }).fetch();
    const serverUser = serverUsers.find((x) => {
      return (x._id === this.userId);
    });
    debugConsole(serverUser);
    if (serverUser !== undefined) {
      if ((this.name !== serverUser.username) ||
      (this.money !== serverUser.profile.money) ||
      (this.ticket !== serverUser.profile.voteTickets)) {
        isChange = true;
        this.name = serverUser.username;
        this.money = serverUser.profile.money;
        this.ticket = serverUser.profile.voteTickets;
      }
    }
    else {
      console.log(`-----serverUser === undefined`);
      debugConsole(serverUsers);
    }

    debugConsole(`-----isChange: ${isChange}`);
    if (isChange) {
      this.saveToSessionstorage();
    }
    debugConsole(this);

    console.log(`---end updateUser()`);
  }


  computeCompanyNumber() {
    console.log(`---start computeCompanyNumber()`);

    let number = 0;
    for (const c of this.holdStocks) {
      if (c.stocks > 0) {
        number += 1;
      }
    }

    console.log(`---end computeCompanyNumber(): ${number}`);

    return number;
  }
  computeAsset() {
    console.log(`---start computeAsset()`);

    let asset = 0;
    const localCompanies = getLocalCompanies();
    for (const c of this.holdStocks) {
      const companyData = localCompanies.find((x) => {
        return x.companyId === c.companyId;
      });
      if (companyData !== undefined) {
        asset += Number(companyData.price * c.stocks);
      }
      else {
        console.log(`-----computeAsset(): not find companyId: ${c.companyId}`);
      }
    }

    console.log(`---end computeAsset(): ${asset}`);

    return asset;
  }
  computeProfit() {
    console.log(`---start computeProfit()`);

    let profit = 0;
    const localCompanies = getLocalCompanies();
    for (const c of this.holdStocks) {
      const companyData = localCompanies.find((x) => {
        return x.companyId === c.companyId;
      });
      if (companyData !== undefined) {
        profit += Math.ceil(earnPerShare(companyData) * effectiveStocks(c.stocks, c.vip));
      }
      else {
        console.log(`-----computeProfit(): not find companyId: ${c.companyId}`);
      }
    }

    console.log(`---end computeProfit(): ${profit}`);

    return profit;
  }
  computeManagersProfit() {
    console.log(`---start computeManagersProfit()`);

    let managerProfit = 0;
    const localCompanies = getLocalCompanies();
    for (const c of this.managers) {
      const companyData = localCompanies.find((x) => {
        return x.companyId === c.companyId;
      });
      if (companyData !== undefined) {
        managerProfit += Math.ceil(companyData.profit * (companyData.managerBonusRatePercent / 100));
      }
      else {
        console.log(`-----computeManagersProfit(): not find companyId: ${c.companyId}`);
      }
    }

    console.log(`---end computeManagersProfit(): ${managerProfit}`);

    return managerProfit;
  }
  computeEmployeeBonus() {
    console.log(`---start computeEmployeeBonus()`);

    let bonus = 0;
    if (this.employee !== '') {
      const localCompanies = getLocalCompanies();
      const companyData = localCompanies.find((x) => {
        return x.companyId === this.employee;
      });
      if (companyData !== undefined) {
        if (companyData.employeesNumber !== 0) {
          const totalBonus = companyData.profit * (companyData.employeeBonusRatePercent / 100);
          bonus = Math.floor(totalBonus / companyData.employeesNumber);
        }
      }
    }

    console.log(`---end computeEmployeeBonus(): ${bonus}`);

    return bonus;
  }
  computeProductVotingRewards() {
    console.log(`---start computeProductVotingRewards()`);

    let reward = 0;

    //計算系統推薦票回饋
    const { systemProductVotingReward } = Meteor.settings.public;
    const totalReward = systemProductVotingReward;
    const initialVoteTicketCount = getInitialVoteTicketCount(getCurrentSeason());
    if (initialVoteTicketCount < 1) {
      //當本季無推薦票可投時無獎勵
      return 0;
    }
    const count = (initialVoteTicketCount - this.ticket) || 0;
    reward += (count >= initialVoteTicketCount) ? totalReward : Math.ceil(totalReward * count / 100);

    //計算公司推薦票回饋
    if (this.employee !== '') {
      const { employeeProductVotingRewardRatePercent } = Meteor.settings.public.companyProfitDistribution;
      const localCompanies = getLocalCompanies();
      const companyData = localCompanies.find((x) => {
        return x.companyId === this.employee;
      });
      debugConsole(companyData);
      if (companyData !== undefined) {
        if (companyData.employeesNumber !== 0) {
          const baseReward = (employeeProductVotingRewardRatePercent / 100) * companyData.profit;
          //因為沒辦法得知全部員工投票數，以其他所有員工都有投完票來計算
          const totalEmployeeVoteTickets = initialVoteTicketCount * (companyData.employeesNumber - 1) + count;
          reward += (Math.ceil(baseReward * count / totalEmployeeVoteTickets) || 0);
        }
        else {
          console.log(`-----companyData.employeesNumber === 0`);
        }
      }
      else {
        console.log(`-----companyData === undefined`);
      }
    }

    console.log(`---end computeProductVotingRewards(): ${reward}`);

    return reward;
  }


  computeStockTax() {
    const stockTax = computeTax(this.computeTotalStockWealth());
    console.log(`---computeStockTax(): ${stockTax}`);

    return stockTax;
  }

  computeTotalStockWealth() {
    const totalStockWealth = this.computeAsset();
    console.log(`---computeTotalStockWealth(): ${totalStockWealth}`);

    return totalStockWealth;
  }

  computeMoneyTax() {
    const moneyTaxMagnification = 1.3;
    const moneyTax = computeTax(this.computeTotalMoney() * moneyTaxMagnification);
    console.log(`---computeMoneyTax(): ${moneyTax}`);

    return moneyTax;
  }

  computeTotalMoney() {
    const totalMoney = this.money + this.computeProfit() +
      this.computeManagersProfit() + this.computeEmployeeBonus() + this.computeProductVotingRewards();
    console.log(`---computeTotalMoney(): ${totalMoney}`);

    return totalMoney;
  }

  computeTotalTax() {
    console.log(`---start computeTax()`);
    const tax = this.computeMoneyTax() + this.computeStockTax();
    console.log(`---end computeTax(): ${tax}`);

    return tax;
  }


  /**
   * 依照持股比例排序持有公司並輸出
   * @return {Array} 列表
   */
  findMostStockholdingCompany() {
    const localCompanies = getLocalCompanies();
    this.loadFromSessionstorage();
    const holdStocks = JSON.parse(JSON.stringify(this.holdStocks));
    holdStocks.sort((a, b) => {
      const companyA = localCompanies.find((x) => {
        return (x.companyId === a.companyId);
      });
      const companyB = localCompanies.find((x) => {
        return (x.companyId === a.companyId);
      });
      if ((companyA === undefined) && (companyB === undefined)) {
        return 0;
      }
      else if (companyA === undefined) {
        return 1;
      }
      else if (companyB === undefined) {
        return -1;
      }
      else {
        return ((b.stocks / companyB.release) - (a.stocks / companyA.release));
      }
    });

    return holdStocks;
  }
}
