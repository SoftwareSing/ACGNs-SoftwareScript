//start file: ./src/main.js
// ==UserScript==
// @name         ACGN-stock營利統計外掛
// @namespace    http://tampermonkey.net/
// @version      5.08.02
// @description  隱藏著排他力量的分紅啊，請在我面前顯示你真正的面貌，與你締結契約的VIP命令你，封印解除！
// @author       SoftwareSing
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @match        https://test.acgn-stock.com/*
// @match        https://museum.acgn-stock.com/*
// @grant        none
// ==/UserScript==

//版本號為'主要版本號 + '.' + 次要版本號 + 錯誤修正版本號，ex 8.31.39
//修復導致功能失效的錯誤或更新重大功能提升主要或次要版本號
//優化UI，優化效能，優化小錯誤更新錯誤版本號


//-start file: ./src\Language/language.js
/*************************************/
/**************Language***************/

/**
 * 語言翻譯
 * @param {Array} target 目標語句
 * @return {String} 回傳語句
 */
function translation(target) {
  const language = 'tw';

  return (dict[language][target[0]][target[1]]);
}

const dict = {
  tw: {
    script: {
      name: 'SoftwareScript',
      updateScript: '更新外掛',
      vip: '外掛VIP',
      about: '關於',
      showMostStockholdingCompany: '列出最多持股公司',

      bigLog: '大量紀錄'
    },
    companyList: {
      stockAsset: '持有總值',
      estimatedProfit: '預估分紅',
      estimatedManagerProfit: '預估經理分紅',
      peRatio: '帳面本益比',
      peRatioVip: '排他本益比',
      peRatioUser: '我的本益比'
    },
    accountInfo: {
      estimatedTax: '預估稅金：',
      holdingStockCompaniesNumber: '持股公司總數：',
      stocksAsset: '股票總值：',
      usedInSellOrdersStocksAsset: '賣單股票總值：',
      usedInBuyOrdersMoney: '買單現金總值：',
      estimatedStockProfit: '預估股票分紅：',
      estimatedManagerProfit: '預估經理分紅：',
      estimatedEmployeeBonus: '預估員工分紅：',
      estimatedProductVotingRewards: '預估推薦票獎勵：',

      holdStocksTable: '持股資訊總表',
      holdStocks: '持有股數',
      holdPercentage: '持有比例',
      stockAsset: '股票總值',
      estimatedProfit: '預估分紅',
      vipLevel: 'VIP等級',
      notFoundCompany: 'not found company'
    },
    company: {
      companyId: '公司ID',
      name: '公司名稱',
      chairman: '董事長',
      manager: '經理人',

      grade: '公司評級',
      capital: '資本額',
      price: '股價',
      release: '釋股數',
      profit: '營收',

      vipBonusStocks: 'VIP加成股票數',
      managerBonusRatePercent: '經理分紅百分比',
      capitalIncreaseRatePercent: '資本額注入百分比',

      salary: '員工日薪',
      nextSeasonSalary: '下季員工日薪',
      employeeBonusRatePercent: '員工分紅百分比',
      employeesNumber: '員工數量',
      nextSeasonEmployeesNumber: '下季員工數量',

      tags: '標籤',
      createdAt: '創立時間'
    }
  },
  en: {
    script: {
      name: 'SoftwareScript',
      updateScript: 'update Script',
      vip: 'script VIP',
      about: 'about',
      showMostStockholdingCompany: 'show most stocks company',

      bigLog: 'Big log'
    },
    companyList: {
      stockAsset: 'Stock asset',
      estimatedProfit: 'Estimated profit',
      estimatedManagerProfit: 'Estimated manager profit',
      peRatio: 'fake P/E Ratio',
      peRatioVip: 'truly P/E Ratio',
      peRatioUser: 'my P/E Ratio'
    },
    accountInfo: {
      estimatedTax: 'Estimated tax：',
      holdingStockCompaniesNumber: 'Holding stock companies number：',
      stocksAsset: 'Stocks asset：',
      usedInSellOrdersStocksAsset: 'Used in sell orders stocks asset：',
      usedInBuyOrdersMoney: 'Used in buy orders money：',
      estimatedStockProfit: 'Estimated stock profit：',
      estimatedManagerProfit: 'Estimated manager profit：',
      estimatedEmployeeBonus: 'Estimated employee profit：',
      estimatedProductVotingRewards: 'Estimated Product Voting Rewards：',

      holdStocksTable: 'Hold stocks info table',
      holdStocks: 'Hold stock number',
      holdPercentage: 'Hold percentage',
      stockAsset: 'Stock asset',
      estimatedProfit: 'Estimated profit',
      vipLevel: 'VIP level',
      notFoundCompany: 'not found company'
    },
    company: {
      companyId: 'company\'s ID',
      name: 'name',
      chairman: 'chairman',
      manager: 'manager',

      grade: 'grade',
      capital: 'capital',
      price: 'price',
      release: 'release',
      profit: 'profit',

      vipBonusStocks: 'Vip bonus stocks',
      managerBonusRatePercent: 'Manager bonus rate percent',
      capitalIncreaseRatePercent: 'Capital increase rate percent',

      salary: 'Employees daily salary',
      nextSeasonSalary: 'Employees daily salary for next season',
      employeeBonusRatePercent: 'Employee bonus rate percent',
      employeesNumber: 'Employees number',
      nextSeasonEmployeesNumber: 'Employees number for next season',

      tags: 'tags',
      createdAt: 'Created time'
    }
  }
};

/**************Language***************/
/*************************************/
//-end file: ./src\Language/language.js
// ===========================
//-start file: ./src\Global/MainController.js
//--start file: ./src\User/LoginUser.js
//---start file: ./src\User/User.js
//----start file: ./src/require.js
/*************************************/
/***************import****************/

const { getCurrentSeason, getInitialVoteTicketCount } = require('./db/dbSeason');
const { alertDialog } = require('./client/layout/alertDialog.js');
const { formatDateText } = require('./client/utils/helpers.js');

const { dbCompanies } = require('./db/dbCompanies.js');
const { dbEmployees } = require('./db/dbEmployees.js');
const { dbVips } = require('./db/dbVips.js');
const { dbDirectors } = require('./db/dbDirectors.js');
const { dbOrders } = require('./db/dbOrders.js');
const { dbUserOwnedProducts } = require('./db/dbUserOwnedProducts.js');
const { dbLog } = require('./db/dbLog.js');

/***************import****************/
/*************************************/
//----end file: ./src/require.js
//    ===========================
//----start file: ./src\functions/debugConsole.js
/*************************************/
/**************DebugMode**************/

const debugMode = false;
//debugMode == true 的時候，會console更多資訊供debug

function debugConsole(msg) {
  if (debugMode) {
    console.log(msg);
  }
}


/**************DebugMode**************/
/*************************************/
//----end file: ./src\functions/debugConsole.js
//    ===========================
//----start file: ./src\functions/getLocalCompanies.js
/**
 * 獲取在localStorage中的localCompanies
 * @return {Array} localCompanies
 */
function getLocalCompanies() {
  const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];

  return localCompanies;
}
//----end file: ./src\functions/getLocalCompanies.js
//    ===========================
//----start file: ./src\functions/earnPerShare.js
/**
 * 計算每股盈餘(包含VIP排他)
 * @param {Company} company 公司物件
 * @return {Number} 每股盈餘
 */
function earnPerShare(company) {
  let stocksProfitPercent = (1 -
    (company.managerBonusRatePercent / 100) -
    (company.capitalIncreaseRatePercent / 100) -
    (Meteor.settings.public.companyProfitDistribution.incomeTaxRatePercent / 100)
  );
  if (company.employeesNumber > 0) {
    stocksProfitPercent -= (company.employeeBonusRatePercent / 100);
    stocksProfitPercent -= (Meteor.settings.public.companyProfitDistribution.employeeProductVotingRewardRatePercent / 100);
  }

  return ((company.profit * stocksProfitPercent) / (company.release + company.vipBonusStocks));
}
//----end file: ./src\functions/earnPerShare.js
//    ===========================
//----start file: ./src\functions/effectiveStocks.js
/**
 * 依照股票與vipLV計算有效分紅股票
 * @param {Number} stock 股票數
 * @param {Number} vipLevel vip等級
 * @return {Number} 有效的股票數
 */
function effectiveStocks(stock, vipLevel) {
  const { stockBonusFactor: vipBonusFactor } = Meteor.settings.public.vipParameters[vipLevel || 0];

  return (stock * vipBonusFactor);
}
//----end file: ./src\functions/effectiveStocks.js
//    ===========================

/**
 * 用於存放AccountInfo頁面中的user資訊
 */
class User {
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

  computeTotalWealth() {
    const totalWealth = this.money +
      this.computeAsset() + this.computeProfit() +
      this.computeManagersProfit() + this.computeEmployeeBonus() +
      this.computeProductVotingRewards();
    console.log(`---computeTotalWealth(): ${totalWealth}`);

    return totalWealth;
  }
  computeTax() {
    console.log(`---start computeTax()`);

    const totalWealth = this.computeTotalWealth();

    const taxRateTable = [
      { asset: 10000, rate: 0.00, adjustment: 0 },
      { asset: 100000, rate: 0.03, adjustment: 300 },
      { asset: 500000, rate: 0.06, adjustment: 3300 },
      { asset: 1000000, rate: 0.09, adjustment: 18300 },
      { asset: 2000000, rate: 0.12, adjustment: 48300 },
      { asset: 3000000, rate: 0.15, adjustment: 108300 },
      { asset: 4000000, rate: 0.18, adjustment: 198300 },
      { asset: 5000000, rate: 0.21, adjustment: 318300 },
      { asset: 6000000, rate: 0.24, adjustment: 468300 },
      { asset: 7000000, rate: 0.27, adjustment: 648300 },
      { asset: 8000000, rate: 0.30, adjustment: 858300 },
      { asset: 9000000, rate: 0.33, adjustment: 1098300 },
      { asset: 10000000, rate: 0.36, adjustment: 1368300 },
      { asset: 11000000, rate: 0.39, adjustment: 1668300 },
      { asset: 12000000, rate: 0.42, adjustment: 1998300 },
      { asset: 13000000, rate: 0.45, adjustment: 2358300 },
      { asset: 14000000, rate: 0.48, adjustment: 2748300 },
      { asset: 15000000, rate: 0.51, adjustment: 3168300 },
      { asset: 16000000, rate: 0.54, adjustment: 3618300 },
      { asset: 17000000, rate: 0.57, adjustment: 4098300 },
      { asset: Infinity, rate: 0.60, adjustment: 4608300 }
    ];
    const { rate, adjustment } = taxRateTable.find((e) => {
      return (totalWealth < e.asset);
    });
    const tax = Math.ceil(totalWealth * rate - adjustment);

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
//---end file: ./src\User/User.js
//   ===========================
//---start file: ./src\User/ScriptVip.js

class ScriptVip {
  /**
   * ScriptVip constructor
   * @param {LoginUser} user LoginUser
   */
  constructor(user) {
    this.user = user;
    this.products = [];

    const load = this.loadFromLocalstorage();
    if (! load) {
      this.updateToLocalstorage();
    }
  }

  updateToLocalstorage() {
    const localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
    const i = localScriptVipProducts.findIndex((x) => {
      return (x.userId === this.user.userId);
    });
    if (i !== -1) {
      localScriptVipProducts[i].products = this.products;
    }
    else {
      localScriptVipProducts.push({
        userId: this.user.userId,
        products: this.products
      });
    }
    window.localStorage.setItem('localScriptVipProducts', JSON.stringify(localScriptVipProducts));
  }
  loadFromLocalstorage() {
    const localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
    const data = localScriptVipProducts.find((x) => {
      return (x.userId === this.user.userId);
    });
    if (data !== undefined) {
      this.products = data.products;

      return true;
    }
    else {
      return false;
    }
  }

  vipLevel() {
    let point = 0;
    for (const product of this.products) {
      point += product.point * product.amount;
    }

    const vipLevelTable = [
      {level: 0, point: 390},
      {level: 1, point: Infinity}
    ];
    const { level } = vipLevelTable.find((v) => {
      return (point < v.point);
    });

    return level;
  }

  updateProducts() {
    this.loadFromLocalstorage();

    const serverUserOwnedProducts = dbUserOwnedProducts.find({ userId: this.user.userId}).fetch();
    let isChange = false;
    for (const p of serverUserOwnedProducts) {
      const i = this.products.findIndex((x) => {
        return (x.productId === p.productId);
      });
      if (i !== -1) {
        isChange = true;
        this.products[i].amount = p.amount;
      }
    }

    if (isChange) {
      this.updateToLocalstorage();
    }
  }
}
//---end file: ./src\User/ScriptVip.js
//   ===========================

/**
 * 目前登入中的使用者
 */
class LoginUser extends User {
  constructor() {
    const id = Meteor.userId();
    console.log(`create LoginUser: ${id}`);
    super(id);
    this.orders = [];
    this.scriptVip = new ScriptVip(this);

    this.directorsCache = [];

    Template.accountDialog.onRendered(() => {
      setTimeout(() => {
        this.changeLoginUser();
      }, 1000);
    });

    console.log('');
  }

  //可能是原本沒登入後來登入了，所以要寫入id，或是分身......
  changeLoginUser() {
    console.log(`try to changeLoginUser......`);
    const id = Meteor.userId();
    if (id) {
      console.log(`LoginUser: new ID: ${id}`);
      this.userId = id;
    }
    else {
      setTimeout(() => {
        this.changeLoginUser();
      }, 1000);
    }
  }

  updateFullHoldStocks() {
    console.log(`---start updateFullHoldStocks()`);

    this.loadFromSessionstorage();

    const serverDirectors = dbDirectors.find({ userId: this.userId }).fetch();
    //避免多次不必要的重複寫入，檢查是否與快取的一模一樣
    if (JSON.stringify(serverDirectors) !== JSON.stringify(this.directorsCache)) {
      const oldHoldStocks = this.holdStocks;
      this.holdStocks = [];
      for (const c of serverDirectors) {
        const oldC = oldHoldStocks.find((x) => {
          return (x.companyId === c.companyId);
        });
        //從舊資料中獲取vip等級資訊，避免將vip資訊洗掉
        const vipLevel = (oldC !== undefined) ? oldC.vip : null;
        this.holdStocks.push({companyId: c.companyId, stocks: c.stocks, vip: vipLevel});
      }

      this.saveToSessionstorage();
      this.directorsCache = serverDirectors;
    }

    console.log(`---end updateFullHoldStocks()`);
  }

  updateOrders() {
    console.log(`---start updateOrders()`);

    this.loadFromSessionstorage();

    const serverOrders = dbOrders.find({ userId: this.userId }).fetch();
    if (JSON.stringify(this.orders) !== JSON.stringify(serverOrders)) {
      this.orders = serverOrders;
      this.saveToSessionstorage();
    }

    console.log(`---end updateOrders()`);
  }

  get buyOrders() {
    const buyOrders = [];
    for (const order of this.orders) {
      if (order.orderType === '購入') {
        buyOrders.push(order);
      }
    }

    return buyOrders;
  }
  computeBuyOrdersMoney() {
    console.log(`---start computeBuyOrdersMoney()`);

    let money = 0;
    for (const order of this.buyOrders) {
      money += order.unitPrice * (order.amount - order.done);
    }

    console.log(`---end computeBuyOrdersMoney(): ${money}`);

    return money;
  }

  get sellOrders() {
    const sellOrders = [];
    for (const order of this.orders) {
      if (order.orderType === '賣出') {
        sellOrders.push(order);
      }
    }

    return sellOrders;
  }
  computeSellOrdersAsset() {
    console.log(`---start computeSellOrdersAsset()`);

    let asset = 0;
    const localCompanies = getLocalCompanies();
    for (const order of this.sellOrders) {
      const companyData = localCompanies.find((x) => {
        return (x.companyId === order.companyId);
      });
      //以參考價計算賣單股票價值, 如果找不到資料則用賣單價格
      const price = (companyData !== undefined) ? companyData.price : order.unitPrice;
      asset += price * (order.amount - order.done);
    }

    console.log(`---end computeSellOrdersAsset(): ${asset}`);

    return asset;
  }

  //Override
  computeTotalWealth() {
    const totalWealth = super.computeTotalWealth() +
      this.computeBuyOrdersMoney() + this.computeSellOrdersAsset();
    console.log(`---LoginUser.computeTotalWealth(): ${totalWealth}`);

    return totalWealth;
  }

  vipLevel() {
    return this.scriptVip.vipLevel();
  }

  updateProducts() {
    this.scriptVip.updateProducts();
  }
}
//--end file: ./src\User/LoginUser.js
//  ===========================
//--start file: ./src\Global/ScriptView.js
//---start file: ./src\Global/View.js
/**
 * View
 */
class View {
  /**
   * 建構 View
   * @param {String} name View的name
   */
  constructor(name) {
    console.log(`create View: ${name}`);
  }

  /**
   * 創建內部用H2元素的資訊列
   * @param {{name: String, leftText: String, rightText: String, customSetting: {left, right}, textOnly: Boolean}} options 設定
   * @return {jquery.$div} HTML元素
   */
  createH2Info(options) {
    const name = options.name || 'defaultName';
    options.customSetting = (options.customSetting) || {};
    const customSetting = {
      left: options.customSetting.left || '',
      right: options.customSetting.right || ''
    };
    const leftText = options.leftText || '';
    const rightText = options.rightText || '';
    const textOnly = options.textOnly || false;

    let r = (`
      <div class='media border-grid-body' name='${name}'>
        <div class='col-6 text-right border-grid' name='${name}' id='h2Left'>
          <h2 name='${name}' id='h2Left' ${customSetting.left}>${leftText}</h2>
        </div>
        <div class='col-6 text-right border-grid' name='${name}' id='h2Right'>
          <h2 name='${name}' id='h2Right' ${customSetting.right}>${rightText}</h2>
        </div>
      </div>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建table元素
   * @param {{name: String, tHead: Array, tBody: Array, customSetting: {table: String, tHead: String, tBody: String}, textOnly: Boolean}} options 設定
   * @return {jquery.$table} table元素
   */
  createTable(options) {
    const name = options.name || 'defaultName';
    options.customSetting = (options.customSetting) || {};
    const customSetting = {
      table: options.customSetting.table || '',
      tHead: options.customSetting.tHead || '',
      tBody: options.customSetting.tBody || ''
    };
    const tHead = options.tHead || [];
    const tBody = options.tBody || [];
    const textOnly = options.textOnly || false;

    let head = '';
    head += `<tr>`;
    for (const h of tHead) {
      head += `<th name=${name} ${customSetting.tHead}>${h}</th>`;
    }
    head += `</tr>`;

    let body = '';
    for (const row of tBody) {
      body += `<tr>`;
      for (const column of row) {
        body += `<td name=${name} ${customSetting.tBody}>${column}</td>`;
      }
      body += `</tr>`;
    }

    let r = (`
      <table border='1' name=${name} ${customSetting.table}>
        <thead name=${name}>
          ${head}
        </thead>
        <tbody name=${name}>
          ${body}
        </tbody>
      </table>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建button元素.
   * size預設為'btn-sm', color預設為'btn-info'
   * @param {{name: String, size: String, color: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$button} button元素
   */
  createButton(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const size = options.size || 'btn-sm';
    const color = options.color || 'btn-info';
    const text = options.text || 'default';
    const textOnly = options.textOnly || false;

    let r = (`
      <button class='btn ${color} ${size}' name='${name}' ${customSetting}>${text}</button>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建select元素.
   * @param {{name: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$select} select元素
   */
  createSelect(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const textOnly = options.textOnly || false;

    let r = (`
      <select class='form-control' name='${name}' ${customSetting}>
      </select>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建option元素.
   * text同時用於 顯示文字 與 指定的value
   * @param {{name: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$option} select元素
   */
  createSelectOption(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const text = options.text || 'defaultText';
    const textOnly = options.textOnly || false;

    let r = (`
      <option name='${name}' value='${text}' ${customSetting}>${text}</option>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建input元素.
   * @param {{name: String, defaultText: String, placeholder: String, type: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$input} input元素
   */
  createInput(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const defaultValue = options.defaultValue || '';
    const placeholder = options.placeholder || '';
    const type = options.type || 'text';
    const textOnly = options.textOnly || false;

    let r = (`
      <input class='form-control'
        name='${name}'
        type='${type}'
        placeholder='${placeholder}'
        value='${defaultValue}'
        ${customSetting}
      />
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建a元素.
   * 如不需要超連結 僅純顯示文字 請不要設定href,
   * 如不需要新開頁面 則不用設定target
   * @param {{name: String, href: String, target: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$a} a元素
   */
  createA(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const href = options.href ? `href='${options.href}'` : '';
    const target = options.target ? `target='${options.target}'` : '';
    const text = options.text || '';
    const textOnly = options.textOnly || false;

    let r = (`
      <a class='float-left'
        name='${name}'
        ${href}
        ${target}
        ${customSetting}
      >${text}</a>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建DropDownMenu
   * @param {{name: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$div} DropDownMenu
   */
  createDropDownMenu(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const text = options.text || '';
    const textOnly = options.textOnly || false;

    let r = (`
      <div class='note' name='${name}'>
        <li class='nav-item dropdown text-nowrap' name='${name}'>
          <a class='nav-link dropdown-toggle' href='#' data-toggle='dropdown' name='${name}' ${customSetting}>${text}</a>
          <div class='dropdown-menu px-3 nav-dropdown-menu'
            aria-labelledby='navbarDropdownMenuLink'
            name='${name}'>
            <div name='${name}' id='afterThis'>
            <div name='${name}' id='beforeThis'>
            </div>
          </div>
        </li>
      </div>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }

  /**
   * 創建DropDownMenu的option
   * @param {{name: String, text: String, href: String, target: String, customSetting: String, textOnly: Boolean}} options 設定
   * @return {jquery.$li} DropDownMenu的option
   */
  createDropDownMenuOption(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const text = options.text || '';
    const href = options.href ? `href='${options.href}'` : '';
    const target = options.target ? `target='${options.target}'` : '';
    const textOnly = options.textOnly || false;

    let r = (`
      <li class='nav-item' name='${name}'>
        <a class='nav-link text-truncate'
          name='${name}'
          ${href}
          ${target}
          ${customSetting}
        >${text}</a>
      </li>
    `);
    if (! textOnly) {
      r = $(r);
    }

    return r;
  }
}
//---end file: ./src\Global/View.js
//   ===========================

/**
 * 控制所有頁面都看的到的物件的View
 */
class ScriptView extends View {
  /**
   * 建構 ScriptView
   * @param {MainController} controller controller
   */
  constructor(controller) {
    super('ScriptView');
    this.controller = controller;
  }

  displayDropDownMenu() {
    const displayObject = this.createDropDownMenu({
      name: 'softwareScriptMenu',
      text: (translation(['script', 'name']))
    });

    $(`div[name='softwareScriptMenu']`).remove();
    const afterObject = $(`div[class='note']`)[2];
    displayObject.insertAfter(afterObject);
  }
  /**
   * 在外掛的下拉選單顯示輸入的物件
   * @param {{name: String, text: String, href: String, target: String, customSetting: String}} options 顯示的物件
   * @param {$jquerySelect} beforeObject insertBefore的物件
   * @return {void}
   */
  displayDropDownMenuOption(options, beforeObject) {
    const name = options.name;
    const customSetting = options.customSetting;
    const text = options.text;
    const href = options.href;
    const target = options.target;
    const displayObject = this.createDropDownMenuOption({
      name: name,
      customSetting: customSetting,
      text: text,
      href: href,
      target: target
    });

    displayObject.insertBefore(beforeObject);
  }

  displayScriptMenu() {
    const beforeDiv = $(`div[id='beforeThis'][name='softwareScriptMenu']`)[0];
    this.displayDropDownMenuOption(
      {
        name: 'aboutPage',
        text: translation(['script', 'about']),
        href: '/SoftwareScript/about'
      },
      beforeDiv
    );
    this.displayDropDownMenuOption(
      {
        name: 'scriptVipPage',
        text: translation(['script', 'vip']),
        href: '/SoftwareScript/scriptVIP'
      },
      beforeDiv
    );

    const hr = $(`<hr name='mostStocksCompany' />`);
    hr.insertBefore(beforeDiv);
    this.displayDropDownMenuOption(
      {
        name: 'showMostStockholdingCompany',
        text: translation(['script', 'showMostStockholdingCompany']),
        href: '#',
        customSetting: `style='font-size: 13px;'`
      },
      beforeDiv
    );
    $(`a[name='showMostStockholdingCompany']`)[0].addEventListener('click', () => {
      this.controller.showMostStockholdingCompany();
    });
  }
  /**
   * 顯示最多持股公司列表
   * @param {Array} list 要顯示的列表
   * @return {void}
   */
  displayMostStockholdingCompany(list) {
    $(`li[class='nav-item'][name='mostStockholdingCompany']`).remove();

    const beforeDiv = $(`div[id='beforeThis'][name='softwareScriptMenu']`)[0];
    for (const company of list) {
      this.displayDropDownMenuOption(
        {
          name: 'mostStockholdingCompany',
          text: company.name,
          href: `/company/detail/${company.companyId}`
        },
        beforeDiv
      );
    }
  }
}
//--end file: ./src\Global/ScriptView.js
//  ===========================
//--start file: ./src\Global/CloudUpdater.js
//---start file: ./src\Global/ScriptAd.js
/**
 * 外掛廣告
 */
class ScriptAd {
  constructor() {
    console.log('create: ScriptAd');
  }

  /**
   * 回傳廣告顯示的文字
   * @param {Boolean} demo 是否用於demo
   * @return {String} HTML代碼
   */
  createAdMsg(demo) {
    const demoType = demo ? `demo='true'` : `demo='false'`;
    const localScriptAd = JSON.parse(window.localStorage.getItem('localScriptAd')) || {};
    let msg = `<a class='float-left' name='scriptAd' id='0'>&nbsp;&nbsp;</a>`;
    let linkNumber = 0;

    if (localScriptAd.adFormat) {
      for (let i = 0; i < localScriptAd.adFormat.length; i += 1) {
        if (localScriptAd.adFormat[i] === 'a') {
          msg += `<a class='float-left' name='scriptAd' id='${i + 1}' ${demoType}>${localScriptAd.adData[i]}</a>`;
        }
        else if (localScriptAd.adFormat[i] === 'aLink') {
          const linkType = localScriptAd.adLinkType[linkNumber];
          let type = '';
          if ((linkType === '_blank') || (linkType === '_parent') || (linkType === '_top')) {
            type = `target='${linkType}'`;
          }
          const href = `href='${localScriptAd.adLink[linkNumber]}'`;
          msg += `<a class='float-left' name='scriptAd' id='${i + 1}' ${demoType} ${type} ${href}>${localScriptAd.adData[i]}</a>`;

          linkNumber += 1;
        }
      }
    }

    return msg;
  }

  displayScriptAd() {
    const msg = this.createAdMsg(false);
    const afterObject = $(`a[class='text-danger float-left'][href='https://github.com/mrbigmouth/acgn-stock/issues']`)[0];
    $(msg).insertAfter(afterObject);
  }

  removeScriptAd() {
    $(`a[name='scriptAd'][demo='false']`).remove();
  }
}
//---end file: ./src\Global/ScriptAd.js
//   ===========================

/**
 * 用來連線雲端以更新資料
 */
class CloudUpdater {
  /**
   * 建構CloudUpdater
   * @param {*} serverType 現在連的股市伺服器
   */
  constructor(serverType) {
    this.serverType = serverType;

    const myVersion = GM_info.script.version; // eslint-disable-line camelcase
    this.version = Number(myVersion.substr(0, 4));
  }

  /**
   * 以非同步方式取得另外整理過的公司資料 json
   * @param {String} url 資料的網址
   * @return {function} 可以用來更新資料的function
   */
  getWebData(url) {
    let webObjCache = null;

    const webUrl = String(url);
    const request = new XMLHttpRequest();
    request.open('GET', webUrl); // 非同步 GET
    request.addEventListener('load', () => {
      debugConsole('got webData');
      try {
        webObjCache = JSON.parse(request.responseText);
      }
      catch (err) {
        webObjCache = request.responseText;
      }
    });
    request.send();

    return (callback) => {
      // 若快取資料存在，則直接回傳快取
      if (webObjCache !== null) {
        callback(webObjCache);

        return;
      }

      // 若無快取資料，則加入事件監聽，等載入後再回傳資料
      request.addEventListener('load', function() {
        callback(webObjCache);
      });
    };
  }

  checkUpdateTime(url, localUpdateTime, updater) {
    const cloud = this.getWebData(url);
    cloud((cloudInfo) => {
      const cloudTime = cloudInfo.updateTime;
      const conformedVersion = Number(cloudInfo.conformedVersion);
      console.log(`cloud url: ${url}`);
      console.log(`${localUpdateTime} === ${cloudTime}: ${localUpdateTime === cloudTime}`);
      console.log(`${this.version} >= ${conformedVersion}: ${this.version >= conformedVersion}`);
      if (cloudTime === localUpdateTime) {
        console.log(`cloud don't have new data`);
        console.log('');
      }
      else if (this.version >= conformedVersion) {
        console.log(`cloud have new data`);
        console.log('');
        updater(cloudTime);
      }
      else {
        console.log(`script version(${this.version}) is too old, can not update`);
        console.log(`cloud data only supports version ${conformedVersion} or later`);
        console.log('');
      }
    });
  }

  checkCompaniesUpdate() {
    let timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptCompany/updateInfo.json';
    let dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptCompany/companies.json';
    if (this.serverType === 'museum') {
      dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-museum/script/company/companys.json';
      timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-museum/script/company/updateTime.json';
    }

    const updater = (cloudTime) => {
      const cloud = this.getWebData(dataUrl);
      cloud((cloudData) => {
        const inputData = cloudData || [];
        window.localStorage.setItem('localCompanies', JSON.stringify(inputData));
        const inputTime = cloudTime || 'null';
        window.localStorage.setItem('localCompaniesUpdateTime', JSON.stringify(inputTime));

        console.log(`localCompanies update complete`);
      });
    };
    const localCompaniesUpdateTime = JSON.parse(window.localStorage.getItem('localCompaniesUpdateTime')) || 'null';
    this.checkUpdateTime(timeUrl, localCompaniesUpdateTime, updater);
  }

  checkScriptAdUpdate() {
    const timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptAD/updateInfo.json';
    const dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptAD/AD.json';

    const updater = (cloudTime) => {
      const cloud = this.getWebData(dataUrl);
      cloud((cloudData) => {
        const inputData = cloudData || [];
        window.localStorage.setItem('localScriptAd', JSON.stringify(inputData));
        const inputTime = cloudTime || 'null';
        window.localStorage.setItem('localScriptAdUpdateTime', JSON.stringify(inputTime));

        const scriptAd = new ScriptAd();
        scriptAd.removeScriptAd();
        scriptAd.displayScriptAd();

        console.log(`scriptAd update complete`);
      });
    };
    const localScriptAdUpdateTime = JSON.parse(window.localStorage.getItem('localScriptAdUpdateTime')) || 'null';
    this.checkUpdateTime(timeUrl, localScriptAdUpdateTime, updater);
  }

  checkScriptVipProductsUpdate() {
    const timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptVIP/updateInfo.json';
    const dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptVIP/scriptVipProducts.json';

    const updater = (cloudTime) => {
      const cloud = this.getWebData(dataUrl);
      cloud((cloudData) => {
        const inputData = cloudData || [];
        const localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
        const defaultUser = {
          userId: 'default',
          products: inputData
        };
        const j = localScriptVipProducts.findIndex((x) => {
          return (x.userId === defaultUser.userId);
        });
        if (j === -1) {
          localScriptVipProducts.push(defaultUser);
        }
        localScriptVipProducts.forEach((user, i, array) => {
          array[i].products = inputData;
        });

        window.localStorage.setItem('localScriptVipProducts', JSON.stringify(localScriptVipProducts));


        const inputTime = cloudTime || 'null';
        window.localStorage.setItem('localScriptVipProductsUpdateTime', JSON.stringify(inputTime));

        console.log(`scriptVipProducts update complete`);
      });
    };
    const localScriptVipProductsUpdateTime = JSON.parse(window.localStorage.getItem('localScriptVipProductsUpdateTime')) || 'null';
    this.checkUpdateTime(timeUrl, localScriptVipProductsUpdateTime, updater);
  }
}
//--end file: ./src\Global/CloudUpdater.js
//  ===========================
//--start file: ./src\CompanyListPage/CompanyListController.js
//---start file: ./src\Global/EventController.js

//監聽頁面，資料準備完成時執行event
//不應該直接呼叫，他應該被繼承
//使用例:
// class CompanyDetailController extends EventController {
//   constructor(user) {
//     super('CompanyDetailController', user);
//     this.templateListener(Template.companyDetailContentNormal, 'Template.companyDetailContentNormal', this.startEvent);
//     this.templateListener(Template.companyDetail, 'Template.companyDetail', this.startEvent2);
//   }
//   startEvent() {
//     console.log('companyDetailContentNormal success');
//     console.log(Meteor.connection._mongo_livedata_collections.employees.find().fetch());
//     console.log('');
//   }
//   startEvent2() {
//     console.log('companyDetail success');
//     console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
//     console.log('');
//   }
// }

/**
 * 頁面的Controller
 */
class EventController {
  /**
   * 建構 EventController
   * @param {String} controllerName 名字
   * @param {LoginUser} loginUser 登入的使用者
   */
  constructor(controllerName, loginUser) {
    console.log(`create controller: ${controllerName}`);
    this.loginUser = loginUser;
  }

  /**
   * 監聽是否載入完成，完成後呼叫callback
   * @param {Template} template 監聽的Template
   * @param {String} templateName 監聽的Template的名字，用於console
   * @param {function} callback callbock
   * @return {void}
   */
  templateListener(template, templateName, callback) {
    template.onCreated(function() {
      const rIsDataReady = new ReactiveVar(false);
      this.autorun(() => {
        rIsDataReady.set(this.subscriptionsReady());
      });
      this.autorun(() => {
        if (rIsDataReady.get()) {
          console.log(`${templateName} loaded`);
          callback();
        }
        else {
          console.log(`${templateName} is loading`);
        }
      });
    });
  }

  /**
   * 資料夾監聽器，監聽到點擊後呼叫callback
   * @param {String} panelFolderName 資料夾的名稱
   * @param {Function} callback callback
   * @return {void}
   */
  panelFolderListener(panelFolderName, callback) {
    Template.panelFolder.events({
      'click [data-toggle-panel-folder]'(event, templateInstance) {
        const { name } = templateInstance.data;
        if (name === panelFolderName) {
          setTimeout(() => {
            callback();
          }, 0);
        }
      }
    });
  }
}
//---end file: ./src\Global/EventController.js
//   ===========================
//---start file: ./src\Company/Companies.js
//----start file: ./src\Company/Company.js
/**
 * CompanyObject
 */
class Company {
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
//----end file: ./src\Company/Company.js
//    ===========================

/**
 * Company的集合，會創建多個company放在裡面
 */
class Companies {
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
//---end file: ./src\Company/Companies.js
//   ===========================
//---start file: ./src\CompanyListPage/CompanyListView.js

/**
 * CompanyList的View
 */
class CompanyListView extends View {
  /**
   * 建構CompanyListView
   * @param {LoginUser} loginUser LoginUser
   */
  constructor(loginUser) {
    super('CompanyListView');
    this.loginUser = loginUser;

    //強制覆蓋
    Template.companyListCard._callbacks.rendered = [];
  }

  get localCompanies() {
    const nowTime = new Date();
    //避免在短時間內過於頻繁的存取 localStorage
    if (! this.lastGetTime) {
      this.lastGetTime = nowTime;
      this._localCompanies = getLocalCompanies();
    }
    else if ((nowTime.getTime() - this.lastGetTime.getTime()) > 3000) {
      this.lastGetTime = nowTime;
      this._localCompanies = getLocalCompanies();
    }

    return this._localCompanies;
  }

  addCardInfo(instance) {
    function insertAfterLastRow(row) {
      instance.$('.row-info').last()
        .after(row);
    }

    function hideRow(row) {
      row.removeClass('d-flex').addClass('d-none');
    }

    function showRow(row) {
      row.removeClass('d-none').addClass('d-flex');
    }


    const getStockAmount = Template.companyListCard.__helpers[' getStockAmount'];
    const infoRowSample = instance.$('.row-info').last();

    const ownValueRow = infoRowSample.clone();
    ownValueRow.find('p:eq(0)').html(translation(['companyList', 'stockAsset']));
    insertAfterLastRow(ownValueRow);

    const profitRow = infoRowSample.clone();
    profitRow.find('p:eq(0)').html(translation(['company', 'profit']));
    insertAfterLastRow(profitRow);

    const peRatioRow = infoRowSample.clone();
    peRatioRow.find('p:eq(0)').html(translation(['companyList', 'peRatio']));
    insertAfterLastRow(peRatioRow);

    const peRatioVipRow = infoRowSample.clone();
    peRatioVipRow.find('p:eq(0)').html(translation(['companyList', 'peRatioVip']));
    insertAfterLastRow(peRatioVipRow);

    const peRatioUserRow = infoRowSample.clone();
    peRatioUserRow.find('p:eq(0)').html(translation(['companyList', 'peRatioUser']));
    insertAfterLastRow(peRatioUserRow);

    const userProfitRow = infoRowSample.clone();
    userProfitRow.find('p:eq(0)').html(translation(['companyList', 'estimatedProfit']));
    insertAfterLastRow(userProfitRow);

    const managerSalaryRow = infoRowSample.clone();
    managerSalaryRow.find('p:eq(0)').html(translation(['companyList', 'estimatedManagerProfit']));
    insertAfterLastRow(managerSalaryRow);


    instance.autorun(() => {
      const serverCompany = Template.currentData();
      const company = new Company(serverCompany);
      const companyData = this.localCompanies.find((x) => {
        return (x.companyId === company.companyId);
      });
      if (companyData !== undefined) {
        company.updateWithLocalcompanies(companyData);
      }

      profitRow.find('p:eq(1)').html(`$ ${Math.round(company.profit)}`);

      const vipBonusStocks = Number(company.vipBonusStocks);
      company.vipBonusStocks = 0;
      const peRatio = company.price / earnPerShare(company);
      company.vipBonusStocks = vipBonusStocks;
      peRatioRow.find('p:eq(1)').html(isFinite(peRatio) ? peRatio.toFixed(2) : '∞');

      const peRatioVip = company.price / earnPerShare(company);
      peRatioVipRow.find('p:eq(1)').html(isFinite(peRatioVip) ? peRatioVip.toFixed(2) : '∞');


      if (Meteor.user()) {
        const stockAmount = getStockAmount(company.companyId);
        if (stockAmount > 0) {
          const stockAmount = getStockAmount(company.companyId);
          const ownValue = stockAmount * company.price;
          ownValueRow.find('p:eq(1)').html(`$ ${ownValue}`);
          showRow(ownValueRow);

          const holdC = this.loginUser.holdStocks.find((x) => {
            return (x.companyId === company.companyId);
          }) || {vip: null};
          const userProfit = Math.round(earnPerShare(company) * effectiveStocks(stockAmount, holdC.vip));
          userProfitRow.find('p:eq(1)').html(`$ ${userProfit}`);
          showRow(userProfitRow);

          const peRatioUser = ownValue / userProfit;
          peRatioUserRow.find('p:eq(1)').html(isFinite(peRatioUser) ? peRatioUser.toFixed(2) : '∞');
          showRow(peRatioUserRow);
        }
        else {
          hideRow(ownValueRow);
          hideRow(userProfitRow);
          hideRow(peRatioUserRow);
        }

        if (Meteor.userId() !== company.manager) {
          hideRow(managerSalaryRow);
        }
        else {
          const managerSalary = Math.round(company.profit * (company.managerBonusRatePercent / 100));
          managerSalaryRow.find('p:eq(1)').html(`$ ${managerSalary}`);
          showRow(managerSalaryRow);
        }
      }
      else {
        hideRow(ownValueRow);
        hideRow(userProfitRow);
        hideRow(managerSalaryRow);
        hideRow(peRatioUserRow);
      }
    });
  }
}
//---end file: ./src\CompanyListPage/CompanyListView.js
//   ===========================

/**
 * CompanyList的Controller
 */
class CompanyListController extends EventController {
  /**
   * 建構 CompanyListController
   * @param {LoginUser} loginUser 登入中的使用者
   */
  constructor(loginUser) {
    super('CompanyListController', loginUser);

    this.companyListView = new CompanyListView(this.loginUser);

    Template.companyListCard.onRendered(() => {
      const instance = Template.instance();
      this.companyListView.addCardInfo(instance);
    });

    this.templateListener(Template.companyList, 'Template.companyList', () => {
      this.updateUserInfo();
      this.useCompaniesInfo();
    });
  }

  updateUserInfo() {
    this.loginUser.updateFullHoldStocks();
    this.loginUser.updateOrders();
  }

  useCompaniesInfo() {
    const companies = new Companies();
    companies.companyPatch();

    companies.updateToLocalstorage();
  }
}
//--end file: ./src\CompanyListPage/CompanyListController.js
//  ===========================
//--start file: ./src\CompanyDetailPage/CompanyDetailController.js
//---start file: ./src\BigLog/LogRecorder.js

/**
 * 用於紀錄所有log
 */
class LogRecorder {
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
//---end file: ./src\BigLog/LogRecorder.js
//   ===========================
//---start file: ./src\BigLog/BigLogView.js

/**
 * 大量紀錄 的View
 * 用於顯示 大量紀錄 資料夾, 以及顯示大量紀錄
 */
class BigLogView extends View {
  /**
   * 建構 BigLogView
   * @param {String} name 資料夾的名稱
   */
  constructor(name) {
    super(`create BigLogView`);
    this.getDescriptionHtml = Template.displayLog.__helpers[' getDescriptionHtml'];
    this.name = String(name);
  }

  showBigLogFolder() {
    const intoObject = $(`div[class='row border-grid-body']`);
    if (intoObject.length > 0) {
      const tmpInto = $(`div[class='col-12 border-grid'][name=${this.name}]`);
      if (tmpInto.length < 1) {
        this.displayBigLogFolder();
      }
    }
    else {
      setTimeout(() => {
        this.showBigLogFolder();
      }, 10);
    }
  }
  displayBigLogFolder() {
    const intoObject = $(`div[class='row border-grid-body']`).first();
    const appendDiv = (`<div class='col-12 border-grid' name=${this.name}></div>`);
    intoObject.append(appendDiv);
    const tmpInto = $(`div[class='col-12 border-grid'][name=${this.name}]`)[0];
    Blaze.renderWithData(
      Template.panelFolder,
      {name: this.name, title: `${translation(['script', 'bigLog'])}`},
      tmpInto
    );
  }

  /**
   * 顯示大量紀錄
   * @param {Array} localLog 要顯示的紀錄列表
   * @return {void}
   */
  displayBigLog(localLog) {
    const intoObject = ($(`a[data-toggle-panel-folder=${this.name}]`)
      .closest(`div[class='col-12']`)
      .next(`div[class='col-12']`)
      .first());
    for (const log of localLog) {
      const displayObject = (`
        <div class='logData' style='word-break: break-all;'>
          <span class='text-info'>(${formatDateText(log.createdAt)})</span>
          ${this.getDescriptionHtml(log)}
        </div>
      `);
      intoObject.append(displayObject);
    }
    this.displayLogDetailInfo(intoObject);
  }
  displayLogDetailInfo(intoObject) {
    // 由於試了幾次實在沒辦法直接從伺服器抓出來
    // 本段直接複製自股市Github
    // /client/utils/displayLog.js
    intoObject.find('[data-user-link]').each((_, elem) => {
      const $link = $(elem);
      const userId = $link.attr('data-user-link');

      // TODO write a helper
      if (userId === '!system') {
        $link.text('系統');
      }
      else if (userId === '!FSC') {
        $link.text('金管會');
      }
      else {
        $.ajax({
          url: '/userInfo',
          data: { id: userId },
          dataType: 'json',
          success: ({ name: userName, status }) => {
            if (status === 'registered') {
              const path = FlowRouter.path('accountInfo', { userId });
              $link.html(`<a href='${path}'>${userName}</a>`);
            }
            else {
              $link.text(userName);
            }
          }
        });
      }
    });

    intoObject.find('[data-company-link]').each((_, elem) => {
      const $link = $(elem);
      const companyId = $link.attr('data-company-link');
      $.ajax({
        url: '/companyInfo',
        data: { id: companyId },
        dataType: 'json',
        success: ({ name: companyName, status }) => {
          let path;
          // TODO write a helper
          switch (status) {
            case 'foundation': {
              path = FlowRouter.path('foundationDetail', { foundationId: companyId });
              break;
            }
            case 'market': {
              path = FlowRouter.path('companyDetail', { companyId });
              break;
            }
          }
          $link.html(`<a href='${path}'>${companyName}</a>`);
        }
      });
    });

    intoObject.find('[data-product-link]').each((_, elem) => {
      const $link = $(elem);
      const productId = $link.attr('data-product-link');
      $.ajax({
        url: '/productInfo',
        data: { id: productId },
        dataType: 'json',
        success: ({ url, productName }) => {
          $link.html(`<a href='${url}' target='_blank'>${productName}</a>`);
        }
      });
    });
  }
}
//---end file: ./src\BigLog/BigLogView.js
//   ===========================

/**
 * CompanyDetail的Controller
 */
class CompanyDetailController extends EventController {
  /**
   * 建構 CompanyDetailController
   * @param {LoginUser} loginUser 登入中的使用者
   */
  constructor(loginUser) {
    super('CompanyDetailController', loginUser);

    this.logRecorder = new LogRecorder();
    this.bigLogView = new BigLogView('companyBigLog');

    this.whoFirst = null;
    this.loaded = null;
    this.templateListener(Template.companyDetail, 'Template.companyDetail', () => {
      this.useCompaniesInfo();
    });
    this.templateListener(Template.companyDetailContentNormal, 'Template.companyDetailContentNormal', () => {
      this.useEmployeesInfo();
    });
    this.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', () => {
      this.useUserOwnedProductsInfo();
    });
    this.templateListener(Template.companyLogList, 'Template.companyLogList', () => {
      this.useLogInfo();
    });

    Template.companyDetailContentNormal.onRendered(() => {
      this.bigLogView.showBigLogFolder();
    });
    this.panelFolderListener('companyBigLog', () => {
      const state = $(`a[data-toggle-panel-folder='companyBigLog']`).find(`i[class='fa fa-folder-open']`);
      if (state.length > 0) {
        const detailId = FlowRouter.getParam('companyId');
        let localLog = this.logRecorder.find('companyId', detailId);
        localLog = this.logRecorder.sort(localLog);
        this.bigLogView.displayBigLog(localLog);
      }
    });
  }

  useCompaniesInfo() {
    console.log(`start useCompaniesInfo()`);

    this.companies = new Companies();
    this.companies.companyPatch();

    const detailId = FlowRouter.getParam('companyId');
    if ((this.whoFirst === 'employees') && (this.loaded === detailId)) {
      //這個比較慢執行，employees資料已經載入完成了
      this.companies.updateEmployeesInfo();
      this.companies.updateToLocalstorage();
      this.whoFirst = null;
      this.loaded = null;
    }
    else {
      this.whoFirst = 'companies';
      this.loaded = detailId;
    }

    console.log(`end useCompaniesInfo()`);
  }

  useEmployeesInfo() {
    console.log(`start useEmployeesInfo`);

    const detailId = FlowRouter.getParam('companyId');
    if ((this.whoFirst === 'companies') && (this.loaded === detailId)) {
      //這個比較慢執行，companies已經建好了
      this.companies.updateEmployeesInfo();
      this.companies.updateToLocalstorage();
      this.whoFirst = null;
      this.loaded = null;
    }
    else {
      this.whoFirst = 'employees';
      this.loaded = detailId;
    }

    console.log(`end useEmployeesInfo()`);
  }

  useUserOwnedProductsInfo() {
    this.loginUser.updateProducts();
  }

  useLogInfo() {
    this.logRecorder.recordServerLog();
  }
}
//--end file: ./src\CompanyDetailPage/CompanyDetailController.js
//  ===========================
//--start file: ./src\AccountInfoPage/AccountInfoController.js
//---start file: ./src\AccountInfoPage/AccountInfoView.js

/**
 * AccountInfo的View
 */
class AccountInfoView extends View {
  constructor() {
    super('AccountInfoView');

    this.resetDisplayList();
  }

  resetDisplayList() {
    this.displayList = {
      companyNumber: false,
      stocksAsset: false,
      sellOrders: false,
      buyOrders: false,
      hrStocks: false, //分隔線
      stocksProfit: false,
      managersProfit: false,
      employeeBonus: false,
      votingReward: false,
      hrProfit: false, //分隔線
      tax: false
    };
  }

  /**
   * 將上方資訊列全部移除, 並顯示上方資訊列間的分隔線
   * @return {void}
   */
  displayHrLine() {
    if (($(`hr[name='stocksLine']`).length < 1) && ($(`hr[name='profitLine']`).length < 1)) {
      $(`div[name='companyNumber']`).remove();
      $(`div[name='stocksAsset']`).remove();
      $(`div[name='sellOrders']`).remove();
      $(`div[name='buyOrders']`).remove();

      $(`div[name='stocksProfit']`).remove();
      $(`div[name='managersProfit']`).remove();
      $(`div[name='employeeBonus']`).remove();
      $(`div[name='votingReward']`).remove();

      $(`div[name='tax']`).remove();

      this.resetDisplayList();
    }

    if ($(`hr[name='stocksLine']`).length < 1) {
      const stocksLine = $(`<hr name='stocksLine' />`);
      const afterObject = ($(`h1[class='card-title']`)[0]);
      stocksLine.insertAfter(afterObject);
      this.displayList.hrStocks = stocksLine;
    }

    if ($(`hr[name='profitLine']`).length < 1) {
      const profitLine = $(`<hr name='profitLine' />`);
      const afterObject = this.displayList.hrStocks || ($(`h1[class='card-title']`)[0]);
      profitLine.insertAfter(afterObject);
      this.displayList.hrProfit = profitLine;
    }
  }

  displayCompanyNumber(companyNumber) {
    const displayObject = this.createH2Info({
      name: 'companyNumber',
      leftText: translation(['accountInfo', 'holdingStockCompaniesNumber']),
      rightText: `${companyNumber}`
    });

    $(`div[name='companyNumber']`).remove();
    const afterObject = $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.companyNumber = displayObject;
  }
  displayStocksAsset(stocksAsset) {
    const displayObject = this.createH2Info({
      name: 'stocksAsset',
      leftText: translation(['accountInfo', 'stocksAsset']),
      rightText: `$ ${stocksAsset}`
    });

    $(`div[name='stocksAsset']`).remove();
    const afterObject = this.displayList.companyNumber || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.stocksAsset = displayObject;
  }
  displaySellOrders(sellOrders) {
    const displayObject = this.createH2Info({
      name: 'sellOrders',
      leftText: translation(['accountInfo', 'usedInSellOrdersStocksAsset']),
      rightText: `$ ${sellOrders}`
    });

    $(`div[name='sellOrders']`).remove();
    const afterObject = this.displayList.stocksAsset || this.displayList.companyNumber || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.sellOrders = displayObject;
  }
  displayBuyOrders(buyOrders) {
    const displayObject = this.createH2Info({
      name: 'buyOrders',
      leftText: translation(['accountInfo', 'usedInBuyOrdersMoney']),
      rightText: `$ ${buyOrders}`
    });

    $(`div[name='buyOrders']`).remove();
    const afterObject = this.displayList.sellOrders || this.displayList.stocksAsset ||
      this.displayList.companyNumber || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.buyOrders = displayObject;
  }

  displayStocksProfit(stocksProfit) {
    const displayObject = this.createH2Info({
      name: 'stocksProfit',
      leftText: translation(['accountInfo', 'estimatedStockProfit']),
      rightText: `$ ${stocksProfit}`
    });

    $(`div[name='stocksProfit']`).remove();
    const afterObject = this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.stocksProfit = displayObject;
  }
  displayManagersProfit(managersProfit) {
    const displayObject = this.createH2Info({
      name: 'managersProfit',
      leftText: translation(['accountInfo', 'estimatedManagerProfit']),
      rightText: `$ ${managersProfit}`
    });

    $(`div[name='managersProfit']`).remove();
    const afterObject = this.displayList.stocksProfit || this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.managersProfit = displayObject;
  }
  displayEmployeeBonus(employeeBonus) {
    const displayObject = this.createH2Info({
      name: 'employeeBonus',
      leftText: translation(['accountInfo', 'estimatedEmployeeBonus']),
      rightText: `$ ${employeeBonus}`
    });

    $(`div[name='employeeBonus']`).remove();
    const afterObject = this.displayList.managersProfit || this.displayList.stocksProfit ||
      this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.employeeBonus = displayObject;
  }
  displayVotingReward(votingReward) {
    const displayObject = this.createH2Info({
      name: 'votingReward',
      leftText: translation(['accountInfo', 'estimatedProductVotingRewards']),
      rightText: `$ ${votingReward}`
    });

    $(`div[name='votingReward']`).remove();
    const afterObject = this.displayList.employeeBonus || this.displayList.managersProfit ||
      this.displayList.stocksProfit || this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.votingReward = displayObject;
  }

  displayTax(tax) {
    const displayObject = this.createH2Info({
      name: 'tax',
      leftText: translation(['accountInfo', 'estimatedTax']),
      rightText: `$ ${tax}`
    });

    $(`div[name='tax']`).remove();
    const afterObject = this.displayList.hrProfit || this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.tax = displayObject;
  }


  displayHoldStocksTableFolder() {
    const intoObject = $(`div[class='row border-grid-body']`).first();
    const appendDiv = (`<div class='col-12 border-grid' name='holdStocksTable'></div>`);
    intoObject.append(appendDiv);
    const tmpInto = $(`div[class='col-12 border-grid'][name='holdStocksTable']`)[0];
    Blaze.renderWithData(
      Template.panelFolder,
      {name: 'holdStocksTable', title: `${translation(['accountInfo', 'holdStocksTable'])}`},
      tmpInto
    );
  }
  displayHoldStocksTable(tableInfo) {
    const oldTable = $(`table[name='holdStocksTable']`);
    oldTable.remove();
    //雖然通常來說 oldTable 應該不存在，不過...

    const tHead = tableInfo.tHead || [];
    const tBody = tableInfo.tBody || [];

    const intoObject = ($(`a[data-toggle-panel-folder='holdStocksTable']`)
      .closest(`div[class='col-12']`)
      .next(`div[class='col-12']`)
      .first());
    const displayObject = this.createTable({
      name: 'holdStocksTable',
      tHead: tHead,
      tBody: tBody,
      customSetting: {tBody: `style='min-width: 75px; max-width: 390px;'`},
      textOnly: true
    });
    intoObject.append(displayObject);
  }
}
//---end file: ./src\AccountInfoPage/AccountInfoView.js
//   ===========================

/**
 * AccountInfo的Controller
 */
class AccountInfoController extends EventController {
  /**
   * 建構 AccountInfoController
   * @param {LoginUser} loginUser 登入中的使用者
   */
  constructor(loginUser) {
    super('AccountInfoController', loginUser);
    this.accountInfoView = new AccountInfoView();
    this.logRecorder = new LogRecorder();
    this.bigLogView = new BigLogView('accountBigLog');

    this.user = null;
    this.userId = null;
    this.waitList = [];

    this.templateListener(Template.accountInfo, 'Template.accountInfo', () => {
      this.usersEvent();
    });
    this.templateListener(Template.managerTitleList, 'Template.managerTitleList', () => {
      this.managersEvent();
    });
    this.templateListener(Template.vipTitleList, 'Template.vipTitleList', () => {
      this.vipsEvent();
    });
    this.templateListener(Template.accountInfoOwnStockList, 'Template.accountInfoOwnStockList', () => {
      this.ownStocksEvent();
    });
    this.templateListener(Template.accountInfoOwnedProductsPanel, 'Template.accountInfoOwnedProductsPanel', () => {
      this.ownProductsEvent();
    });
    this.templateListener(Template.accountAccuseLogList, 'Template.accountAccuseLogList', () => {
      this.logEvent();
    });
    this.templateListener(Template.accountInfoLogList, 'Template.accountInfoLogList', () => {
      this.logEvent();
    });

    Template.accountInfoBasic.onRendered(() => {
      //理論上監聽 accountInfoBasic 不太對，應該監聽 accountInfo
      //不過在切到別的帳號時不會觸發 accountInfo ，倒是一定會觸發 accountInfoBasic
      this.showHoldStocksTableFolder();
      this.bigLogView.showBigLogFolder();
    });
    this.panelFolderListener('holdStocksTable', () => {
      const state = $(`a[data-toggle-panel-folder='holdStocksTable']`).find(`i[class='fa fa-folder-open']`);
      if (state.length > 0) {
        this.accountInfoView.displayHoldStocksTable(this.holdStocksTableInfo());
      }
    });
    this.panelFolderListener('accountBigLog', () => {
      const state = $(`a[data-toggle-panel-folder='accountBigLog']`).find(`i[class='fa fa-folder-open']`);
      if (state.length > 0) {
        const userId = FlowRouter.getParam('userId');
        let localLog = this.logRecorder.filter((x) => {
          if (x.userId) {
            for (const user of x.userId) {
              if (user === userId) {
                return true;
              }
            }
          }

          return false;
        });
        localLog = this.logRecorder.sort(localLog);
        this.bigLogView.displayBigLog(localLog);
      }
    });
  }

  usersEvent() {
    console.log(`start usersEvent()`);

    this.userId = FlowRouter.getParam('userId');
    if (this.userId === undefined) {
      return;
    }

    if (this.userId === this.loginUser.userId) {
      this.user = this.loginUser;
    }
    else {
      this.user = new User(this.userId);
    }
    this.user.loadFromSessionstorage();
    this.user.updateUser();
    this.user.updateEmployee();


    //顯示資訊
    this.accountInfoView.displayHrLine();

    this.accountInfoView.displayCompanyNumber(this.user.computeCompanyNumber());
    this.accountInfoView.displayStocksAsset(this.user.computeAsset());
    if (this.user.userId === this.loginUser.userId) {
      this.accountInfoView.displaySellOrders(this.user.computeSellOrdersAsset());
      this.accountInfoView.displayBuyOrders(this.user.computeBuyOrdersMoney());
    }

    this.accountInfoView.displayStocksProfit(this.user.computeProfit());
    this.accountInfoView.displayManagersProfit(this.user.computeManagersProfit());
    this.accountInfoView.displayEmployeeBonus(this.user.computeEmployeeBonus());
    this.accountInfoView.displayVotingReward(this.user.computeProductVotingRewards());

    this.accountInfoView.displayTax(this.user.computeTax());

    //如果有在user資訊載好前就載入的其他資訊，會被丟進等待清單
    //以for迴圈完成清單內的任務
    for (const task of this.waitList) {
      if (task.userId === this.userId) {
        task.callback();
      }
    }
    this.waitList = [];

    console.log(`end usersEvent()`);
  }

  managersEvent() {
    console.log(`start managersEvent()`);

    const pageId = FlowRouter.getParam('userId');
    if (pageId === undefined) {
      return;
    }
    if (this.userId === pageId) {
      this.user.updateManagers();


      //顯示資訊
      this.accountInfoView.displayHrLine();
      this.accountInfoView.displayManagersProfit(this.user.computeManagersProfit());
      this.accountInfoView.displayTax(this.user.computeTax());
    }
    else {
      this.waitList.push({
        userId: pageId,
        callback: this.managersEvent
      });
    }

    console.log(`end managersEvent()`);
  }

  vipsEvent() {
    console.log(`start vipsEvent()`);

    const pageId = FlowRouter.getParam('userId');
    if (pageId === undefined) {
      return;
    }
    if (this.userId === pageId) {
      this.user.updateVips();


      //顯示資訊
      this.accountInfoView.displayHrLine();
      this.accountInfoView.displayStocksProfit(this.user.computeProfit());
      this.accountInfoView.displayTax(this.user.computeTax());
    }
    else {
      this.waitList.push({
        userId: pageId,
        callback: this.vipsEvent
      });
    }

    console.log(`end vipsEvent()`);
  }

  ownStocksEvent() {
    console.log(`start ownStocksEvent()`);

    const pageId = FlowRouter.getParam('userId');
    if (pageId === undefined) {
      return;
    }
    if (this.userId === pageId) {
      this.user.updateHoldStocks();


      //顯示資訊
      this.accountInfoView.displayHrLine();
      this.accountInfoView.displayCompanyNumber(this.user.computeCompanyNumber());
      this.accountInfoView.displayStocksAsset(this.user.computeAsset());
      this.accountInfoView.displayStocksProfit(this.user.computeProfit());
      this.accountInfoView.displayTax(this.user.computeTax());
    }
    else {
      this.waitList.push({
        userId: pageId,
        callback: this.ownStocksEvent
      });
    }

    console.log(`end ownStocksEvent()`);
  }

  ownProductsEvent() {
    const pageId = FlowRouter.getParam('userId');
    if (pageId === undefined) {
      return;
    }
    if (this.userId === pageId) {
      if (this.user.userId === this.loginUser.userId) {
        this.loginUser.updateProducts();
      }
    }
    else {
      this.waitList.push({
        userId: pageId,
        callback: this.ownProductsEvent
      });
    }
  }

  logEvent() {
    this.logRecorder.recordServerLog();
  }


  showHoldStocksTableFolder() {
    const intoObject = $(`div[class='row border-grid-body']`);
    if (intoObject.length > 0) {
      const tmpInto = $(`div[class='col-12 border-grid'][name='holdStocksTable']`);
      if (tmpInto.length < 1) {
        this.accountInfoView.displayHoldStocksTableFolder();
      }
    }
    else {
      //不知為何，都用 onRendered 了，結果觸發時還是沒有創建...
      setTimeout(() => {
        this.showHoldStocksTableFolder();
      }, 10);
    }
  }

  holdStocksTableInfo() {
    const tHead = [
      translation(['company', 'name']),
      translation(['company', 'price']),
      translation(['company', 'profit']),
      translation(['accountInfo', 'holdStocks']),
      translation(['accountInfo', 'holdPercentage']),
      translation(['accountInfo', 'stockAsset']),
      translation(['accountInfo', 'estimatedProfit']),
      translation(['accountInfo', 'vipLevel'])
    ];
    const tBody = [];

    const holdStocks = JSON.parse(JSON.stringify(this.user.holdStocks));
    if (this.user === this.loginUser) {
      for (const order of this.loginUser.sellOrders) {
        const i = holdStocks.findIndex((x) => {
          return (x.companyId === order.companyId);
        });
        if (i !== -1) {
          holdStocks[i].stocks += (order.amount - order.done);
        }
        else {
          holdStocks.push({companyId: order.companyId, stocks: (order.amount - order.done), vip: null});
        }
      }
    }
    const localCompanies = getLocalCompanies();
    const notFoundList = [];
    for (const holdC of holdStocks) {
      const companyData = localCompanies.find((x) => {
        return (x.companyId === holdC.companyId);
      });
      if (companyData !== undefined) {
        const row = [];
        row.push(`<a href='/company/detail/${companyData.companyId}'>${companyData.name}</a>`);
        row.push(companyData.price);
        row.push(Math.ceil(companyData.profit));
        row.push(holdC.stocks);
        row.push(`${((holdC.stocks / companyData.release) * 100).toFixed(2)}%`);
        row.push(companyData.price * holdC.stocks);
        row.push(Math.ceil(earnPerShare(companyData) * effectiveStocks(holdC.stocks, holdC.vip)));
        const vipLevel = (holdC.vip !== null) ? holdC.vip : 'x';
        row.push(vipLevel);

        tBody.push(row);
      }
      else {
        notFoundList.push(holdC);
      }
    }

    //未被找到的公司統一放在最後
    for (const holdC of notFoundList) {
      const row = [];
      row.push(`<a href='/company/detail/${holdC.companyId}'>${translation(['accountInfo', 'notFoundCompany'])}</a>`);
      row.push('???');
      row.push('???');
      row.push(holdC.stocks);
      row.push('???');
      row.push('???');
      row.push('???');
      const vipLevel = (holdC.vip !== null) ? holdC.vip : 'x';
      row.push(vipLevel);

      tBody.push(row);
    }

    return {tHead: tHead, tBody: tBody};
  }
}
//--end file: ./src\AccountInfoPage/AccountInfoController.js
//  ===========================
//--start file: ./src\ScriptVipPage/ScriptVipController.js
//---start file: ./src\functions/stripscript.js
/**
 * 過濾字串
 * @param {String} s 被過濾的字串
 * @return {String} 過濾完的字串
 */
function stripscript(s) {
  const pattern = new RegExp(`[\`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]`);
  let rs = '';
  for (let i = 0; i < s.length; i += 1) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }

  return rs;
}
//---end file: ./src\functions/stripscript.js
//   ===========================
//---start file: ./src\ScriptVipPage/ScriptVipView.js

/**
 * ScriptVip頁面的View
 */
class ScriptVipView extends View {
  /**
   * 建構 ScriptVipView
   * @param {EventController} controller 控制View的Controller
   */
  constructor(controller) {
    super('ScriptVipView');

    this.controller = controller;
    this.scriptAd = new ScriptAd();

    const tmpVip = new Blaze.Template('Template.softwareScriptVip', () => {
      // eslint-disable-next-line new-cap
      const page = HTML.Raw(`
        <div class='card' name='vip'>
          <div class='card-block' name='Vip'>
            <div class='col-5'>
              <h1 class='card-title mb-1'>SoftwareScript</h1>
              <h1 class='card-title mb-1'>  VIP功能</h1>
            </div>
            <div class='col-5'>您是我的恩客嗎?</div>
            <div class='col-12'>
              <hr>
              <h2 name='becomeVip'>成為VIP</h2>
              <hr>
              <h2 name='scriptAd'>外掛廣告</h2>
              <hr>
              <h2 name='searchTables'>資料搜尋</h2>
              <hr>
              <p>如VIP功能發生問題，請至Discord股市群聯絡SoftwareSing</p>
            </div>
          </div>
        </div>
      `);

      return page;
    });
    Template.softwareScriptVip = tmpVip;
  }

  /**
   * 顯示外掛VIP資訊
   * @param {LoginUser} loginUser 登入中的使用者
   * @return {void}
   */
  displayScriptVipProducts(loginUser) {
    console.log(`start displayScriptVipProducts()`);

    const localScriptVipProductsUpdateTime = JSON.parse(window.localStorage.getItem('localScriptVipProductsUpdateTime')) || 'null';
    const userVIP = loginUser.vipLevel();
    const info = $(`
      <p>VIP條件更新時間: ${localScriptVipProductsUpdateTime}</p>
      <p>您目前的VIP狀態: 等級 ${userVIP}</p>
      <p>VIP權限: </P>
      <ul name='vipCanDo'>
        <li>關閉外掛廣告</li>
        <li>使用資料搜尋功能</li>
      </ul>
      <p>
        VIP點數達390即可使用VIP功能 <br />
        為獲得點數可以購買以下商品
      </p>
      <div name='scriptVipProducts' id='productList'>
      </div>
    `);
    info.insertAfter($(`h2[name='becomeVip']`)[0]);

    const productList = [];
    const localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
    let userProducts = localScriptVipProducts.find((x) => {
      return (x.userId === loginUser.userId);
    });
    if (userProducts === undefined) {
      userProducts = localScriptVipProducts.find((x) => {
        return (x.userId === 'default');
      });
    }
    for (const p of userProducts.products) {
      const description = `<a companyId='${p.companyId}' href='/company/detail/${p.companyId}'>${p.description}</a>`;
      const out = [description, p.point, p.amount];
      productList.push(out);
    }

    const tableObject = this.createTable({
      name: 'scriptVipProducts',
      tHead: ['產品', '點數/個', '持有量'],
      tBody: productList
    });
    tableObject.insertAfter($(`div[name='scriptVipProducts'][id='productList']`)[0]);

    console.log(`end displayScriptVipProducts()`);
  }

  /**
   * 顯示外掛AD資訊
   * @param {LoginUser} loginUser 登入中的使用者
   * @return {void}
   */
  displayScriptAdInfo(loginUser) {
    console.log(`start displayScriptAdInfo()`);

    const localScriptAdUpdateTime = JSON.parse(window.localStorage.getItem('localScriptAdUpdateTime')) || 'null';
    const msg = this.scriptAd.createAdMsg(true);
    const info = $(`
      <p>
        目前的廣告更新時間: ${localScriptAdUpdateTime} <br />
        目前的廣告內容: <br />
        ${msg}
      </p>
      <p>
        <button class='btn btn-info btn-sm' name='openAd'>開啟外掛廣告</button>
        <button class='btn btn-danger btn-sm' name='closeAd'>關閉外掛廣告</button>
      </p>
    `);
    info.insertAfter($(`h2[name='scriptAd']`)[0]);

    if (loginUser.vipLevel() < 1) {
      $(`button[name='closeAd']`)[0].disabled = true;
    }
    else {
      $(`button[name='closeAd']`)[0].addEventListener('click', () => {
        window.localStorage.setItem('localDisplayScriptAd', JSON.stringify(false));
        this.scriptAd.removeScriptAd();
      });
    }

    $(`button[name='openAd']`)[0].addEventListener('click', () => {
      window.localStorage.setItem('localDisplayScriptAd', JSON.stringify(true));
      if ($(`a[name='scriptAd'][demo='false']`).length < 1) {
        this.scriptAd.displayScriptAd();
      }
    });

    console.log(`end displayScriptAdInfo()`);
  }

  /**
   * 顯示SearchTables資訊
   * @param {LoginUser} loginUser 登入中的使用者
   * @return {void}
   */
  displaySearchTables(loginUser) {
    console.log(`start displaySearchTables()`);

    const localCompaniesUpdateTime = JSON.parse(window.localStorage.getItem('localCompaniesUpdateTime')) || 'null';
    const info = $(`
      <p>
        VIP可以用此功能搜尋公司資料<br />
        公司資料為 從雲端同步 或 於瀏覽股市時自動更新，因此可能與最新資料有所落差<br />
        目前的雲端資料更新時間: ${localCompaniesUpdateTime}<br />
        &nbsp;(每次重新載入股市時，會確認雲端是否有更新資料)
      </p>
      <p>&nbsp;</p>
      <p>各項數值名稱對照表(不在表中的數值無法使用)：
        <table border='1' name='valueNameTable'>
          <tr name='companyID'> <td>公司ID</td> <td>ID</td> </tr>
          <tr name='name'> <td>公司名稱</td> <td>name</td> </tr>
          <tr name='chairman'> <td>董事長ID</td> <td>chairman</td> </tr>
          <tr name='manager'> <td>經理人ID</td> <td>manager</td> </tr>

          <tr name='grade'> <td>公司評級</td> <td>grade</td> </tr>
          <tr name='capital'> <td>資本額</td> <td>capital</td> </tr>
          <tr name='price'> <td>股價</td> <td>price</td> </tr>
          <tr name='release'> <td>總釋股量</td> <td>release</td> </tr>
          <tr name='profit'> <td>總營收</td> <td>profit</td> </tr>

          <tr name='vipBonusStocks'> <td>VIP加成股數</td> <td>vipBonusStocks</td> </tr>
          <tr name='managerBonusRatePercent'> <td>經理分紅比例</td> <td>managerBonusRatePercent</td> </tr>
          <tr name='capitalIncreaseRatePercent'> <td>資本額注入比例</td> <td>capitalIncreaseRatePercent</td> </tr>

          <tr name='salary'> <td>本季員工薪水</td> <td>salary</td> </tr>
          <tr name='nextSeasonSalary'> <td>下季員工薪水</td> <td>nextSeasonSalary</td> </tr>
          <tr name='employeeBonusRatePercent'> <td>員工分紅%數</td> <td>employeeBonusRatePercent</td> </tr>
          <tr name='employeesNumber'> <td>本季員工人數</td> <td>employeesNumber</td> </tr>
          <tr name='nextSeasonEmployeesNumber'> <td>下季員工人數</td> <td>nextSeasonEmployeesNumber</td> </tr>

          <tr name='tags'> <td>標籤 tag (陣列)</td> <td>tags</td> </tr>
          <tr name='createdAt'> <td>創立時間</td> <td>createdAt</td> </tr>
        </table>
      </p>
      <p>常用函式：
        <table border='1' name='valueNameTable'>
          <tr name='等於'>
            <td bgcolor='yellow'>等於 (請用2或3個等號)</td>
            <td bgcolor='yellow'>==</td>
          </tr>
          <tr name='OR'>
            <td>x OR(或) y</td>
            <td>(x || y)</td>
          </tr>
          <tr name='AND'>
            <td>x AND y</td>
            <td>(x && y)</td>
          </tr>
          <tr name='toFixed()'>
            <td>把x四捨五入至小數點y位</td>
            <td>x.toFixed(y)</td>
          </tr>
          <tr name='Math.ceil(price * 1.15)'>
            <td>計算漲停價格</td>
            <td>Math.ceil(price * 1.15)</td>
          </tr>
          <tr name='Math.ceil(price * 0.85)'>
            <td>計算跌停價格</td>
            <td>Math.ceil(price * 0.85)</td>
          </tr>
          <tr name='本益比'>
            <td>本益比</td>
            <td>(price * release) / profit</td>
          </tr>
          <tr name='益本比'>
            <td>益本比</td>
            <td>profit / (price * release)</td>
          </tr>
          <tr name='包含'>
            <td>名字中包含 艦これ 的公司</td>
            <td>(name.indexOf('艦これ') > -1)</td>
          </tr>
        </table>
      </p>
      <p>&nbsp;</p>
      <p> <a href='https://hackmd.io/s/SycGT5yIG' target='_blank'>資料搜尋用法教學</a> </p>
      <p>
        <select class='form-control' style='width: 300px;' name='dataSearchList'></select>
        <button class='btn btn-info btn-sm' name='createTable'>建立新的搜尋表</button>
        <button class='btn btn-danger btn-sm' name='deleteTable'>刪除這個搜尋表</button>
        <button class='btn btn-danger btn-sm' name='deleteAllTable'>刪除所有</button>
      </p>
      <p name='showTableName'> 表格名稱： <span class='text-info' name='tableName'></span></p>
      <p name='showTableFilter'>
        過濾公式：<input class='form-control'
          type='text' name='tableFilter'
          placeholder='請輸入過濾公式，如: (price>1000)'>
        <button class='btn btn-info btn-sm' name='addTableFilter'>儲存過濾公式</button>
        <button class='btn btn-danger btn-sm' name='deleteTableFilter'>刪除過濾公式</button>
      </p>
      <p name='showTableSort'>
        排序依據：<input class='form-control'
          type='text' name='tableSort'
          placeholder='請輸入排序公式，如: (price)，小到大請加負號: -(price)'>
        <button class='btn btn-info btn-sm' name='addTableSort'>儲存排序公式</button>
        <button class='btn btn-danger btn-sm' name='deleteTableSort'>刪除排序公式</button>
      </p>
      <p>&nbsp;</p>
      <p name'showTableColumn'>表格欄位<br />
        <button class='btn btn-info btn-sm' name='addTableColumn'>新增欄位</button>
        <table border='1' name'tableColumn'>
          <thead>
            <th>名稱</th>
            <th>公式</th>
            <th>操作</th>
          </thead>
          <tbody name='tableColumn'>
          </tbody>
        </table>
      </p>
      <p>&nbsp;</p>
      <p>
        <button class='btn btn-info' name='outputTable'>輸出結果</button>
        <button class='btn btn-warning' name='clearOutputTable'>清空輸出</button>
      </p>
      <p name='outputTable'></p>
      <p>&nbsp;</p>
    `);
    info.insertAfter($(`h2[name='searchTables']`)[0]);


    $(`button[name='deleteAllTable']`)[0].addEventListener('click', () => {
      alertDialog.confirm({
        title: '刪除所有搜尋表',
        message: `您確定要刪除所有的表格嗎? <br />
                (建議發生嚴重錯誤至無法操作時 再這麼做)`,
        callback: (result) => {
          if (result) {
            this.controller.deleteLocalSearchTables();
          }
        }
      });
    });

    $(`button[name='createTable']`)[0].addEventListener('click', () => {
      alertDialog.dialog({
        type: 'prompt',
        title: '新建搜尋表',
        message: `請輸入表格名稱(如有重複將直接覆蓋)`,
        inputType: 'text',
        customSetting: ``,
        callback: (result) => {
          if (result) {
            this.controller.createNewSearchTable(result);
          }
        }
      });
    });
    $(`button[name='deleteTable']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      alertDialog.confirm({
        title: '刪除搜尋表',
        message: `您確定要刪除表格 ${tableName} 嗎?`,
        callback: (result) => {
          if (result) {
            this.controller.deleteSearchTable(tableName);
          }
        }
      });
    });


    this.displaySearchTablesList();
    if ($(`select[name='dataSearchList']`)[0].value !== '') {
      this.displaySearchTableInfo();
    }


    $(`button[name='addTableFilter']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      const filter = $(`input[name='tableFilter']`)[0].value;
      this.controller.addSearchTableFilter(tableName, filter);
    });
    $(`button[name='deleteTableFilter']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      this.controller.deleteSearchTableFilter(tableName);
      $(`input[name='tableFilter']`)[0].value = '';
    });

    $(`button[name='addTableSort']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      const sort = $(`input[name='tableSort']`)[0].value;
      this.controller.addSearchTableSort(tableName, sort);
    });
    $(`button[name='deleteTableSort']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      this.controller.deleteSearchTableSort(tableName);
      $(`input[name='tableSort']`)[0].value = '';
    });

    $(`button[name='addTableColumn']`)[0].addEventListener('click', () => {
      const tableName = $(`select[name='dataSearchList']`)[0].value;
      alertDialog.dialog({
        type: 'prompt',
        title: '新增欄位',
        message: `請輸入新的欄位名稱`,
        inputType: 'text',
        customSetting: `placeholder='請輸入欄位名稱，如: 本益比'`,
        callback: (newName) => {
          if (newName) {
            alertDialog.dialog({
              type: 'prompt',
              title: '新增欄位',
              message: `請輸入新的公式`,
              inputType: 'text',
              customSetting: `placeholder='請輸入欄位公式，如: (profit / (price * stock))'`,
              callback: (newRule) => {
                if (newRule) {
                  this.controller.addSearchTableColumn(tableName, newName, newRule);
                  this.displaySearchTableColumns(tableName);
                }
              }
            });
          }
        }
      });
    });


    $(`button[name='outputTable']`)[0].addEventListener('click', () => {
      if (loginUser.vipLevel() > 0) {
        const tableName = $(`span[name='tableName']`)[0].innerText;
        if (tableName !== '') {
          const filter = $(`input[name='tableFilter']`)[0].value;
          this.controller.addSearchTableFilter(tableName, filter);
          const sort = $(`input[name='tableSort']`)[0].value;
          this.controller.addSearchTableSort(tableName, sort);

          this.displayOutputTable(tableName);
        }
      }
      else {
        alertDialog.alert('你不是VIP！(怒)');
      }
    });
    $(`button[name='clearOutputTable']`)[0].addEventListener('click', () => {
      $(`table[name=outputTable]`).remove();
    });

    console.log(`end displaySearchTables()`);
  }

  displaySearchTablesList() {
    console.log('---start displaySearchTablesList()');

    $(`option[name='dataSearchList']`).remove();
    const localSearchTables = JSON.parse(window.localStorage.getItem('localSearchTables')) || 'null';
    for (const t of localSearchTables) {
      const item = $(`<option name='dataSearchList' value='${t.tableName}'>${t.tableName}</option>`);
      $(`select[name='dataSearchList']`).append(item);
    }
    $(`select[name='dataSearchList']`)[0].addEventListener('change', () => {
      $(`table[name=outputTable]`).remove();
      this.displaySearchTableInfo();
    });

    console.log('---end displaySearchTablesList()');
  }


  displaySearchTableInfo() {
    console.log('---start displaySearchTableInfo()');

    const selectValue = $(`select[name='dataSearchList']`)[0].value;
    if (selectValue) {
      const localSearchTables = JSON.parse(window.localStorage.getItem('localSearchTables')) || 'null';
      const thisTable = localSearchTables.find((t) => {
        return t.tableName === selectValue;
      });
      $(`span[name='tableName']`)[0].innerText = thisTable.tableName;
      $(`input[name='tableFilter']`)[0].value = thisTable.filter;
      $(`input[name='tableSort']`)[0].value = thisTable.sort;

      this.displaySearchTableColumns(thisTable.tableName);
    }
    else {
      $(`span[name='tableName']`)[0].innerText = '';
      $(`input[name='tableFilter']`)[0].value = '';
      $(`input[name='tableSort']`)[0].value = '';
      $(`tr[name='tableColumn']`).remove();
    }

    console.log('---end displaySearchTableInfo()');
  }

  displaySearchTableColumns(tableName) {
    console.log('---start displaySearchTableColumns()');

    $(`tr[name='tableColumn']`).remove();
    const localSearchTables = JSON.parse(window.localStorage.getItem('localSearchTables')) || 'null';
    const thisTable = localSearchTables.find((t) => {
      return t.tableName === tableName;
    });

    const changeColumn = (c) => {
      alertDialog.dialog({
        type: 'prompt',
        title: '修改欄位',
        message: `請輸入新的欄位名稱`,
        inputType: 'text',
        defaultValue: c.columnName,
        customSetting: ``,
        callback: (newName) => {
          if (newName) {
            alertDialog.dialog({
              type: 'prompt',
              title: '修改欄位',
              message: `請輸入新的公式`,
              inputType: 'text',
              defaultValue: String(c.rule),
              customSetting: ``,
              callback: (newRule) => {
                if (newRule) {
                  this.controller.changeSearchTableColumn(tableName, {name: c.columnName, newName: newName}, newRule);
                  this.displaySearchTableColumns(tableName);
                }
              }
            });
          }
        }
      });
    };
    const deleteColumn = (c) => {
      alertDialog.confirm({
        title: `刪除 ${tableName} 的欄位`,
        message: `您確定要刪除欄位 ${c.columnName} 嗎?`,
        callback: (result) => {
          if (result) {
            this.controller.deleteSearchTableColumn(tableName, c.columnName);
            this.displaySearchTableColumns(tableName);
          }
        }
      });
    };

    for (const c of thisTable.column) {
      const t = (`
        <tr name='tableColumn'>
          <td>${c.columnName}</td>
          <td>${String(c.rule)}</td>
          <td>
            <button class='btn btn-warning btn-sm' name='changeTableColumn' id='${c.columnName}'>修改</button>
            <button class='btn btn-danger btn-sm' name='deleteTableColumn' id='${c.columnName}'>刪除</button>
          </td>
        </tr>
      `);
      $(`tbody[name='tableColumn']`).append(t);
      $(`button[name='changeTableColumn'][id='${c.columnName}']`)[0].addEventListener('click', () => {
        changeColumn(c);
      });
      $(`button[name='deleteTableColumn'][id='${c.columnName}']`)[0].addEventListener('click', () => {
        deleteColumn(c);
      });
    }

    console.log('---end displaySearchTableColumns()');
  }


  displayOutputTable(tableName) {
    $(`table[name=outputTable]`).remove();

    // 需要重整，顯示不應該由SearchTables做
    this.controller.searchTables.outputTable(tableName);
  }
}
//---end file: ./src\ScriptVipPage/ScriptVipView.js
//   ===========================
//---start file: ./src\ScriptVipPage/SearchTables.js

/**
 * 操縱搜尋表的物件
 */
class SearchTables {
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
    const newTable = {'tableName': tableName,
      'filter': null,
      'sort': null,
      'column': []};
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
      this.tables[i].column.push({'columnName': stripscript(columnName), 'rule': rule});
    }
    else {
      this.changeTableColumn(tableName, {name: columnName, newName: columnName}, rule);
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
//---end file: ./src\ScriptVipPage/SearchTables.js
//   ===========================

/**
 * ScriptVip頁面的Controller
 */
class ScriptVipController extends EventController {
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
//--end file: ./src\ScriptVipPage/ScriptVipController.js
//  ===========================
//--start file: ./src\AboutPage/AboutController.js
//---start file: ./src\AboutPage/AboutView.js

class AboutView extends View {
  constructor() {
    super('AboutView');

    const tmpVip = new Blaze.Template('Template.softwareScriptAbout', () => {
      /* eslint-disable max-len */
      // eslint-disable-next-line new-cap
      const page = HTML.Raw(`
      <div class='card' name='about'>
      <div class='card-block' name='about'>
    
        <div id="readme" class="readme blob instapaper_body">
          <article class="markdown-body entry-content" itemprop="text">
            <h1>ACGN-stock營利統計外掛 / SoftwareScript</h1>
            <p>A script helps you play
              <a href="https://acgn-stock.com" rel="nofollow">acgn-stock.com</a>.</p>
            <p>一個幫助你在
              <a href="https://acgn-stock.com" rel="nofollow">acgn-stock.com</a> 獲得更豐富訊息的外掛</p>
            <p>
              <del>純粹因為中文太長，所以英文重新取名而不是照翻</del>
            </p>
            <h2>發布頁面</h2>
            <p>
              <a href="https://github.com/SoftwareSing/ACGNs-SoftwareScript" rel="nofollow" target="_blank">GitHub</a>
              <del>( 內含沒什麼用的圖文版功能說明 )</del>
            </p>
            <p>
              <a href="https://greasyfork.org/zh-TW/scripts/33542" rel="nofollow" target="_blank">GreasyFork</a>
            </p>
            <p></p>
            <h2>目前的功能</h2>
    
            <h3>更豐富的卡面訊息</h3>
            <ul>
              <li>持有總值</li>
              <li>營收</li>
              <li>帳面本益比 (未計算VIP加權股份時的本益比)</li>
              <li>排他本益比 (計算VIP加權股份後 真實的本益比)</li>
              <li>我的本益比 (依照使用者的VIP等級加權股份後得出的本益比)</li>
            </ul>
    
            <h3>帳號的更詳細資訊</h3>
            <p>在翻閱過帳號的持有股份、經理資訊、VIP資訊後，可以在頁面上得到詳細的統計資訊</p>
            <p>(登入中的使用者在進入過 股市總覽 後便可得到詳細的持股資訊)</p>
            <ul>
              <li>持有公司總數</li>
              <li>股票總值 (未計算賣單中的股票)</li>
              <li>賣單股票總值 (僅當前登入中的帳號可查看)</li>
              <li>買單現金總值 (僅當前登入中的帳號可查看)</li>
              <li>預估股票分紅 (已計算VIP加權股份)</li>
              <li>預估經理分紅</li>
              <li>預估員工分紅 (員工獎金 目前最高5%)</li>
              <li>預估推薦票獎勵 (包含系統獎金 與 員工1%獎勵)</li>
              <li>預估稅金 (以上方所有財產、預估獲益來預估下季稅金)</li>
            </ul>
    
            <h3>持股資訊總表</h3>
            <p>在翻閱過帳號的相關訊息後，可以在底下查閱該帳號的持股總表</p>
            <p>(欲更新資訊請重新打開該資料夾)</p>
            <ul>
              <li>股價</li>
              <li>營收</li>
              <li>持有股數 (賣單中的股份一併列出，以下同)</li>
              <li>持有比例</li>
              <li>股票總值</li>
              <li>預估分紅 (已計算VIP加權股份)</li>
              <li>VIP等級</li>
            </ul>
    
            <h3>一次查看更大量的紀錄</h3>
            <p>在公司或帳號底下的 所以紀錄 翻閱過後，可以點選 大量紀錄 來一次顯示所有剛剛翻閱到的紀錄</p>
            <p>(頁面重新整理後紀錄不會留存)</p>
    
            <h3>持有比例最多的公司</h3>
            <p>在進入 股市總覽 過後，在外掛選單中點選 [列出最多持股公司] 依照持股比例由高到低列出所持股的公司</p>
            <p>(重新整理列表請再點一次)</p>
    
            <h3>資料搜尋</h3>
            <p>透過指定的條件來搜尋存在外掛中股市資料</p>
            <p>(功能要求有外掛VIP資格才可使用)</p>
    
            <h3>廣告</h3>
            <p>置底有廣告</p>
          </article>
        </div>
      </div>
    </div>    
      `);
      /* eslint-enable max-len */

      return page;
    });
    Template.softwareScriptAbout = tmpVip;
  }
}
//---end file: ./src\AboutPage/AboutView.js
//   ===========================

class AboutController extends EventController {
  /**
   * AboutScriptController constructor
   * @param {LoginUser} loginUser LoginUser
   */
  constructor(loginUser) {
    super('AboutScriptController', loginUser);

    this.aboutView = new AboutView();
  }
}
//--end file: ./src\AboutPage/AboutController.js
//  ===========================

class MainController {
  constructor() {
    this.loginUser = new LoginUser();
    this.serverType = 'normal';
    const currentServer = document.location.href;
    const serverTypeTable = [
      { type: /museum.acgn-stock.com/, typeName: 'museum' },
      { type: /test.acgn-stock.com/, typeName: 'test' }
    ];
    serverTypeTable.forEach(({ type, typeName }) => {
      if (currentServer.match(type)) {
        this.serverType = typeName;
      }
    });
    this.othersScript = [];

    const softwareScriptRoute = FlowRouter.group({
      prefix: '/SoftwareScript',
      name: 'softwareScriptRoute'
    });
    softwareScriptRoute.route('/', {
      name: 'softwareScript',
      action() {
        DocHead.setTitle(`${Meteor.settings.public.websiteName} - ${translation(['script', 'name'])}`);
      }
    });
    softwareScriptRoute.route('/scriptVIP', {
      name: 'softwareScriptVip',
      action() {
        DocHead.setTitle(`${Meteor.settings.public.websiteName} - ${translation(['script', 'name'])} - ${translation(['script', 'vip'])}`);
      }
    });
    softwareScriptRoute.route('/about', {
      name: 'softwareScriptAbout',
      action() {
        DocHead.setTitle(`${Meteor.settings.public.websiteName} - ${translation(['script', 'name'])} - ${translation(['script', 'about'])}`);
      }
    });
    softwareScriptRoute.route('/blankPage', {
      name: 'blankPage',
      action() {
        DocHead.setTitle(`${Meteor.settings.public.websiteName} - blank page`);
      }
    });

    this.scriptView = new ScriptView(this);
    this.scriptView.displayDropDownMenu();
    this.scriptView.displayScriptMenu();

    this.companyListController = new CompanyListController(this.loginUser);
    this.companyDetailController = new CompanyDetailController(this.loginUser);
    this.accountInfoController = new AccountInfoController(this.loginUser);
    this.scriptVipController = new ScriptVipController(this.loginUser);
    this.aboutController = new AboutController(this.loginUser);
  }

  checkCloudUpdate() {
    const cloudUpdater = new CloudUpdater(this.serverType);
    cloudUpdater.checkCompaniesUpdate();
    cloudUpdater.checkScriptAdUpdate();
    cloudUpdater.checkScriptVipProductsUpdate();
  }

  showScriptAd() {
    const scriptAd = new ScriptAd();
    scriptAd.removeScriptAd();
    scriptAd.displayScriptAd();
  }

  showMostStockholdingCompany() {
    console.log(`start showMostStockholdingCompany()`);

    const max = 30;
    const holdStocks = this.loginUser.findMostStockholdingCompany();
    const list = [];
    const localCompanies = getLocalCompanies();
    let i = 0;
    for (const company of holdStocks) {
      i += 1;
      if (i > max) {
        break;
      }

      const companyData = localCompanies.find((x) => {
        return (x.companyId === company.companyId);
      });
      list.push({
        companyId: company.companyId,
        name: companyData ? companyData.name : '[unknow]'
      });
    }

    this.scriptView.displayMostStockholdingCompany(list);

    console.log(`end showMostStockholdingCompany()`);
  }
}
//-end file: ./src\Global/MainController.js
// ===========================


//這邊記一下每個storage的格式

//localScriptAdUpdateTime       local
//date

//localScriptAd                  local
//{adLinkType: ['_self', '_blank'],
// adLink: ['/company/detail/NJbJuXaJxjJpzAJui', 'https://www.google.com.tw/'],
// adData: ['&nbsp;message&nbsp;', 'miku'],
// adFormat: ['a', 'aLink']}

//localCompaniesUpdateTime        local
//date

//localCompanies規格               local
//{companyID: String, name: String,
// chairman: String, manager: String,
// grade: String, capital: Number,
// price: Number, release: Number, profit: Number,
// vipBonusStocks: Number,
// managerBonusRatePercent: Number,
// capitalIncreaseRatePercent: Number,
// salary: Number, nextSeasonSalary: Number, employeeBonusRatePercent: Number,
// employeesNumber: Number, nextSeasonEmployeesNumber: Number
// tags: Array,
// createdAt: String
//}

//sessionUsers的格式         session
//{userId: 'CWgfhqxbrJMxsknrb',
// holdStocks: [{companyId: aaa, stocks: Number, vip: Number}, {}],
// managers: [{companyId: aaa}, {}],
// employee: 'aaa',
// money: Number,
// ticket: Number}

//localScriptVipProductsUpdateTime        local
//date

//localScriptVipProducts
// {
//   userId: 'CWgfhqxbrJMxsknrb',
//   products: [
//     {
//       productId: '5GEdNG5hjs85ahpxN',
//       point: 100,
//       amount: 0,
//       companyId: 'NH2NhXHkpw8rTuQvx',
//       description: 'ABC'
//     }
//   ]
// }

//localDisplayScriptAd    local
// Boolean

/*************************************/
/*************StartScript*************/

function checkSeriousError() {
  //這個function將會清空所有由本插件控制的localStorage
  //用於如果上一版發生嚴重錯誤導致localStorage錯亂，以致插件無法正常啟動時
  //或是用於當插件更新時，需要重設localStorage

  const seriousErrorVersion = 5.05;
  //seriousErrorVersion會輸入有問題的版本號，當發生問題時我會增加本數字，或是於更新需要時亦會增加
  //使用者本地的數字紀錄如果小於這個數字將會清空所有localStorage

  let lastErrorVersion = Number(window.localStorage.getItem('lastErrorVersion')) || 0;
  //lastErrorVersion = 0;  //你如果覺得現在就有問題 可以把這行的註解取消掉來清空localStorage

  if (Number.isNaN(lastErrorVersion)) {
    lastErrorVersion = 0;
    console.log('reset lastErrorVersion as 0');
  }
  else {
    console.log('localStorage of lastErrorVersion is work');
  }

  if (lastErrorVersion < seriousErrorVersion) {
    console.log('last version has serious error, start remove all localStorage');
    window.localStorage.removeItem('localCompaniesUpdateTime');
    window.localStorage.removeItem('localCompanies');
    window.localStorage.removeItem('localScriptAdUpdateTime');
    window.localStorage.removeItem('localScriptAd');
    window.localStorage.removeItem('localScriptVipProductsUpdateTime');
    window.localStorage.removeItem('localScriptVipProducts');
    window.localStorage.removeItem('localDisplayScriptAd');
    //window.localStorage.removeItem('localSearchTables');
    window.sessionStorage.removeItem('sessionUsers');

    // 舊資料
    window.localStorage.removeItem('local_CsDatas_UpdateTime');
    window.localStorage.removeItem('local_CsDatas');
    window.localStorage.removeItem('local_scriptAD_UpdateTime');
    window.localStorage.removeItem('local_scriptAD');
    window.localStorage.removeItem('local_dataSearch');
    window.localStorage.removeItem('local_scriptAD_use');
    window.localStorage.removeItem('local_scriptVIP_UpdateTime');
    window.localStorage.removeItem('local_scriptVIP');

    window.localStorage.removeItem('lastErrorVersion');
    lastErrorVersion = seriousErrorVersion;
    window.localStorage.setItem('lastErrorVersion', JSON.stringify(lastErrorVersion));
  }
}

function checkScriptUpdate() {
  const oReq = new XMLHttpRequest();
  const checkScriptVersion = (() => {
    const obj = JSON.parse(oReq.responseText);
    const myVersion = GM_info.script.version; // eslint-disable-line camelcase
    console.log(obj.version.substr(0, 4) + ',' + myVersion.substr(0, 4) + ',' + (obj.version.substr(0, 4) > myVersion.substr(0, 4)));
    if (obj.version.substr(0, 4) > myVersion.substr(0, 4)) {
      const updateButton = $(`
        <li class='nav-item'>
          <a class='nav-link btn btn-primary'
          href='https://greasyfork.org/zh-TW/scripts/33542'
          name='updateSoftwareScript'
          target='Blank'
          >${translation(['script', 'updateScript'])}</a>
        </li>
      `);
      updateButton.insertAfter($('.nav-item')[$('.nav-item').length - 1]);
    }
    else {
      setTimeout(checkScriptUpdate, 600000);
    }
  });
  oReq.addEventListener('load', checkScriptVersion);
  oReq.open('GET', 'https://greasyfork.org/scripts/33542.json');
  oReq.send();
}


(function() {
  checkSeriousError();
  checkScriptUpdate();

  setTimeout(startScript, 0);
})();

function startScript() {
  const main = new MainController();
  main.checkCloudUpdate();
  main.showScriptAd();
}


/*************StartScript*************/
/*************************************/
//end file: ./src/main.js
//===========================
