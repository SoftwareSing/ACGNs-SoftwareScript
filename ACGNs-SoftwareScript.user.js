// ==UserScript==
// @name         ACGN-stock營利統計外掛
// @namespace    http://tampermonkey.net/
// @version      5.00.00
// @description  Banishment this world!
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
//本腳本修改自 'ACGN股票系統每股營利外掛 2.200 by papago89'


//這邊記一下每個storage的格式

//local_scriptAD_UpdateTime       local
//date

//local_scriptAD                  local
//{adLinkType: ['_self', '_blank'],
// adLink: ['/company/detail/NJbJuXaJxjJpzAJui', 'https://www.google.com.tw/'],
// adData: ['&nbsp;message&nbsp;', 'miku'],
// adFormat: ['a', 'aLink']}

//local_CsDatas_UpdateTime        local
//date

//localCompanies規格               local
//{companyID: String, name: String,
// chairman: String, manager: String,
// grade: String, capital: Number,
// price: Number, release: Number, profit: Number,
// vipBonusStocks: Number,
// managerProfitPercent: 0.05,
// salary: Number, nextSeasonSalary: Number, bonus: Number,
// employeesNumber: Number, nextSeasonEmployeesNumber: Number
// tags: Array,
// createdAt: String
//}

//userInfo的格式         session
//{userId: 'CWgfhqxbrJMxsknrb',
// holdStocks: [{companyId: aaa, stocks: Number, vip: Number}, {}],
// managers: [{companyId: aaa}, {}],
// employee: 'aaa',
// money: Number,
// ticket: Number}


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
/*************************************/
/***************import****************/

const { getCurrentSeason, getInitialVoteTicketCount } = require('./db/dbSeason');
const {alertDialog} = require('./client/layout/alertDialog.js');

/***************import****************/
/*************************************/
/*************************************/
/************GlobalVariable***********/

//會跨2區以上使用的全域變數放在這裡
//如從stockSummary跨到accountInfo用的變數

let serverType = 'normal';

let myId = null; //當前登入的使用者ID
let myHoldStock = []; //當前登入的使用者持有的股票, 在股市總覽可以直接抓到全部
let myOrders = []; //當前登入的使用者未完成交易的買賣單, 在股市總覽可以直接抓到全部

let othersScript = [];


/************GlobalVariable***********/
/*************************************/
/*************************************/
/**************function***************/

function earnPerShare(company) {
  return (company.profit / (company.release + company.vipBonusStocks));
}

function effectiveStocks(stock, vipLevel) {
  const { stockBonusFactor: vipBonusFactor } = Meteor.settings.public.vipParameters[vipLevel || 0];

  return (stock * vipBonusFactor);
}

/**************function***************/
/*************************************/
/*************************************/
/****************class****************/

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
class EventController {
  constructor(controllerName, user) {
    console.log(`create controller: ${controllerName}`);
    this.loginUser = user;
  }

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
}

class View {
  constructor(name) {
    console.log(`create View: ${name}`);
  }

  createH2Info(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const leftText = options.leftText || '';
    const rightText = options.rightText || '';

    const r = $(`
      <div class='media company-summary-item border-grid-body' name='${name}'>
        <div class='col-6 text-right border-grid' name='${name}' id='h2Left'>
          <h2 name='${name}' id='h2Left' ${customSetting}>${leftText}</h2>
        </div>
        <div class='col-6 text-right border-grid' name='${name}' id='h2Right'>
          <h2 name='${name}' id='h2Right' ${customSetting}>${rightText}</h2>
        </div>
      </div>
    `);

    return r;
  }
  createTable(options) {
    const name = options.name || 'defaultName';
    const customSetting = {
      table: options.customSetting.table || '',
      tHead: options.customSetting.tHead || '',
      tBody: options.customSetting.tBody || ''
    };
    const tHead = options.tHead || [];
    const tBody = options.tBody || [];

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

    const r = $(`
      <table name=${name} ${customSetting.table}>
        <thead name=${name}>
          ${head}
        </thead>
        <tbody name=${name}>
          ${body}
        </tbody>
      </table>
    `);

    return r;
  }
  createButton(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const size = options.size || 'btn-sm';
    const color = options.color || 'btn-info';
    const text = options.text || 'default';

    const r = $(`
      <button class='btn ${color} ${size}' name='${name}' ${customSetting}>${text}</button>
    `);

    return r;
  }
  createSelect(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';

    const r = $(`
      <select class='form-control' name='${name}' ${customSetting}>
      </select>
    `);

    return r;
  }
  createSelectOption(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const text = options.text || 'defaultText';

    const r = $(`
      <option name='${name}' value='${text}' ${customSetting}>${text}</option>
    `);

    return r;
  }
  createInput(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const defaultValue = options.defaultValue || '';
    const placeholder = options.placeholder || '';
    const type = options.type || 'text';

    const r = $(`
      <input class='form-control'
        name='${name}'
        type='${type}'
        placeholder='${placeholder}'
        value='${defaultValue}'
        ${customSetting}
      />
    `);

    return r;
  }
  createA(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const href = options.href ? `href='${options.href}'` : '';
    const target = options.target ? `target='${options.target}'` : '';
    const text = options.text || '';

    const r = $(`
      <a class='float-left'
        name='${name}'
        ${href}
        ${target}
        ${customSetting}
      >${text}</a>
    `);

    return r;
  }
}


class user {
  constructor(id) {
    console.log(`create user: ${id}`);
    this.userId = id;
    this.holdStocks = [];
    this.managers = [];
    this.employee = '';
    this.money = 0;
    this.ticket = 0;
  }

  saveToSessionstorage() {
    console.log(`---start saveToSessionstorage()`);

    const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    const i = userInfo.findIndex((x) => {
      return x.userId === this.userId;
    });
    userInfo[i] = {
      userId: this.userId,
      holdStocks: this.holdStocks,
      managers: this.managers,
      employee: this.employee,
      money: this.money,
      ticket: this.ticket
    };
    window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

    console.log(`---end saveToSessionstorage()`);
  }

  updateHoldStocks(serverDirectors) {
    console.log(`---start updateHoldStocks()`);

    let isChange = false;
    for (const c of serverDirectors) {
      if (c.userId === this.userId) {
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
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateHoldStocks()`);
  }

  updateManagers(serverCompanies) {
    console.log(`---start updateManagers()`);

    let isChange = false;
    for (const c of serverCompanies) {
      if (c.manager === this.userId) {
        if (this.managers.find((x) => {
          return (x.companyId === c._id);
        }) === undefined) {
          isChange = true;
          this.managers.push({companyId: c._id});
        }
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

    console.log(`---end updateManagers()`);
  }

  updateEmployee(serverEmployees) {
    console.log(`---start updateEmployee()`);

    let isChange = false;
    for (const emp of serverEmployees) {
      if (emp.employed && (emp.userId === this.userId)) {
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


  computeAsset() {
    console.log(`---start computeAsset()`);

    let asset = 0;
    const localCompanies = JSON.parse(window.sessionStorage.getItem('localCompanies')) || [];
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
    const localCompanies = JSON.parse(window.sessionStorage.getItem('localCompanies')) || [];
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

  computeManagerProfit() {
    console.log(`---start computeManagerProfit()`);

    let managerProfit = 0;
    const localCompanies = JSON.parse(window.sessionStorage.getItem('localCompanies')) || [];
    for (const c of this.managers) {
      const companyData = localCompanies.find((x) => {
        return x.companyId === c.companyId;
      });
      if (companyData !== undefined) {
        managerProfit += Math.ceil(companyData.profit * companyData.managerProfitPercent);
      }
      else {
        console.log(`-----computeManagerProfit(): not find companyId: ${c.companyId}`);
      }
    }

    console.log(`---end computeManagerProfit(): ${managerProfit}`);

    return managerProfit;
  }

  computeEmployeeBonus() {
    console.log(`---start computeEmployeeBonus()`);

    const localCompanies = JSON.parse(window.sessionStorage.getItem('localCompanies')) || [];
    const companyData = localCompanies.find((x) => {
      return x.companyId === this.employee;
    });
    const totalBonus = companyData.profit * companyData.bonus * 0.01;
    const bonus = Math.floor(totalBonus / companyData.employeesNumber);

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
    const count = initialVoteTicketCount - this.ticket;
    reward += (count >= initialVoteTicketCount) ? totalReward : Math.ceil(totalReward * count / 100);

    //計算公司推薦票回饋
    const { employeeProductVotingRewardFactor } = Meteor.settings.public;
    const localCompanies = JSON.parse(window.sessionStorage.getItem('localCompanies')) || [];
    const companyData = localCompanies.find((x) => {
      return x.companyId === this.employee;
    });
    const baseReward = employeeProductVotingRewardFactor * companyData.profit;
    //因為沒辦法得知全部員工投票數，以其他所有員工都有投完票來計算
    const totalEmployeeVoteTickets = initialVoteTicketCount * (companyData.employee - 1) + count;
    reward += Math.ceil(baseReward * count / totalEmployeeVoteTickets);

    console.log(`---end computeProductVotingRewards(): ${reward}`);

    return reward;
  }

  computeTotalWealth() {
    const totalWealth = this.moeny +
      this.computeAsset() + this.computeProfit() +
      this.computeManagerProfit() + this.computeEmployeeBonus() +
      this.computeProductVotingRewards();

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
}

/****************class****************/
/*************************************/
/*************************************/
/*********ACGNListenerScript**********/
