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

//localCompanies_UpdateTime        local
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

//sessionUsers的格式         session
//{userId: 'CWgfhqxbrJMxsknrb',
// holdStocks: [{companyId: aaa, stocks: Number, vip: Number}, {}],
// managers: [{companyId: aaa}, {}],
// employee: 'aaa',
// money: Number,
// ticket: Number}

//localScriptVipProducts
// {
//   userId: 'CWgfhqxbrJMxsknrb',
//   products: [
//     {
//       productId: '5GEdNG5hjs85ahpxN',
//       point: '100',
//       amount: 0,
//       companyId: 'NH2NhXHkpw8rTuQvx',
//       description: 'ABC'
//     }
//   ]
// }

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
/*************StartScript*************/

function checkSeriousError() {
  //這個function將會清空所有由本插件控制的localStorage
  //用於如果上一版發生嚴重錯誤導致localStorage錯亂，以致插件無法正常啟動時
  //或是用於當插件更新時，需要重設localStorage

  const seriousErrorVersion = 3.701;
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
    window.localStorage.removeItem('localCompanies_UpdateTime');
    window.localStorage.removeItem('localCompanies');

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
}


/*************StartScript*************/
/*************************************/
/*************************************/
/***************import****************/

const { FlowRouter } = require('meteor/kadira:flow-router');
const { getCurrentSeason, getInitialVoteTicketCount } = require('./db/dbSeason');
const { alertDialog } = require('./client/layout/alertDialog.js');

const { dbCompanies } = require('./db/dbCompanies.js');
const { dbEmployees } = require('./db/dbEmployees.js');
const { dbVips } = require('./db/dbVips.js');
const { dbDirectors } = require('./db/dbDirectors.js');
const { dbOrders } = require('./db/dbOrders.js');
const { dbUserOwnedProducts } = require('./db/dbUserOwnedProducts.js');

/***************import****************/
/*************************************/
/*************************************/
/**************function***************/

/**
 * 計算每股盈餘(包含VIP排他)
 * @param {Company} company 公司物件
 * @return {Number} 每股盈餘
 */
function earnPerShare(company) {
  let stocksProfitPercent = (1 - company.managerProfitPercent - 0.15);
  if (company.employeesNumber > 0) {
    stocksProfitPercent -= (company.bonus * 0.01);
  }

  return ((company.profit * stocksProfitPercent) / (company.release + company.vipBonusStocks));
}

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

/**************function***************/
/*************************************/
/*************************************/
/****************class****************/

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

    this.companyListController = new CompanyListController(this.loginUser);
    this.companyDetailController = new CompanyDetailController(this.loginUser);
    this.accountInfoController = new AccountInfoController(this.loginUser);
  }
}

class ScriptVip {
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
  /**
   * 建構某個頁面的Controller
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
}

class View {
  /**
   * View
   * @param {String} name View的name
   */
  constructor(name) {
    console.log(`create View: ${name}`);
  }

  /**
   * 創建內部用H2元素的資訊列
   * @param {{name: String, leftText: String, rightText: String, customSetting: {left, right}}} options 設定
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

    const r = $(`
      <div class='media border-grid-body' name='${name}'>
        <div class='col-6 text-right border-grid' name='${name}' id='h2Left'>
          <h2 name='${name}' id='h2Left' ${customSetting.left}>${leftText}</h2>
        </div>
        <div class='col-6 text-right border-grid' name='${name}' id='h2Right'>
          <h2 name='${name}' id='h2Right' ${customSetting.right}>${rightText}</h2>
        </div>
      </div>
    `);

    return r;
  }

  /**
   * 創建table元素
   * @param {{name: String, tHead: Array, tBody: Array[], customSetting: {table, tHead, tBody}}} options 設定
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

  /**
   * 創建button元素.
   * size預設為'btn-sm', color預設為'btn-info'
   * @param {{name: String, size: String, color: String, text: String, customSetting: String}} options 設定
   * @return {jquery.$button} button元素
   */
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

  /**
   * 創建select元素.
   * @param {{name: String, customSetting: String}} options 設定
   * @return {jquery.$select} select元素
   */
  createSelect(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';

    const r = $(`
      <select class='form-control' name='${name}' ${customSetting}>
      </select>
    `);

    return r;
  }

  /**
   * 創建option元素.
   * text同時用於 顯示文字 與 指定的value
   * @param {{name: String, text: String, customSetting: String}} options 設定
   * @return {jquery.$option} select元素
   */
  createSelectOption(options) {
    const name = options.name || 'defaultName';
    const customSetting = options.customSetting || '';
    const text = options.text || 'defaultText';

    const r = $(`
      <option name='${name}' value='${text}' ${customSetting}>${text}</option>
    `);

    return r;
  }

  /**
   * 創建input元素.
   * @param {{name: String, defaultText: String, placeholder: String, type: String, customSetting: String}} options 設定
   * @return {jquery.$input} input元素
   */
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

  /**
   * 創建a元素.
   * 如不需要超連結 僅純顯示文字 請不要設定href,
   * 如不需要新開頁面 則不用設定target
   * @param {{name: String, href: String, target: String, text: String, customSetting: String}} options 設定
   * @return {jquery.$a} a元素
   */
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


class User {
  /**
   * 用於存放AccountInfo頁面中的user資訊
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
    if (serverUser !== undefined) {
      if ((this.name !== serverUser.username) && (this.money !== serverUser.profile.money) && (this.ticket !== serverUser.profile.voteTickets)) {
        isChange = true;
        this.name = serverUser.username;
        this.money = serverUser.profile.money;
        this.ticket = serverUser.profile.voteTickets;
      }
    }

    if (isChange) {
      this.saveToSessionstorage();
    }

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
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
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
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
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
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
    for (const c of this.managers) {
      const companyData = localCompanies.find((x) => {
        return x.companyId === c.companyId;
      });
      if (companyData !== undefined) {
        managerProfit += Math.ceil(companyData.profit * companyData.managerProfitPercent);
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
      const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      const companyData = localCompanies.find((x) => {
        return x.companyId === this.employee;
      });
      if (companyData !== undefined) {
        if (companyData.employeesNumber !== 0) {
          const totalBonus = companyData.profit * companyData.bonus * 0.01;
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
    const count = initialVoteTicketCount - this.ticket;
    reward += (count >= initialVoteTicketCount) ? totalReward : Math.ceil(totalReward * count / 100);

    //計算公司推薦票回饋
    if (this.employee !== '') {
      const { employeeProductVotingRewardFactor } = Meteor.settings.public;
      const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      const companyData = localCompanies.find((x) => {
        return x.companyId === this.employee;
      });
      if (companyData !== undefined) {
        if (companyData.employeesNumber !== 0) {
          const baseReward = employeeProductVotingRewardFactor * companyData.profit;
          //因為沒辦法得知全部員工投票數，以其他所有員工都有投完票來計算
          const totalEmployeeVoteTickets = initialVoteTicketCount * (companyData.employeesNumber - 1) + count;
          reward += Math.ceil(baseReward * count / totalEmployeeVoteTickets);
        }
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
}

class LoginUser extends User {
  /**
   * 目前登入中的使用者
   */
  constructor() {
    const id = Meteor.userId();
    console.log(`create LoginUser: ${id}`);
    super(id);
    this.orders = [];
    this.scriptVip = new ScriptVip(this);

    this.directorsCache = [];

    console.log('');
  }

  //可能是原本沒登入後來登入了，所以要寫入id，或是分身......
  changeLoginUser() {
    const id = Meteor.userId();
    console.log(`LoginUser: new ID: ${id}`);
    this.userId = id;
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


  computeBuyOrdersMoney() {
    console.log(`---start computeBuyOrdersMoney()`);

    let money = 0;
    for (const order of this.orders) {
      if (order.orderType === '購入') {
        money += order.unitPrice * (order.amount - order.done);
      }
    }

    console.log(`---end computeBuyOrdersMoney(): ${money}`);

    return money;
  }

  computeSellOrdersAsset() {
    console.log(`---start computeSellOrdersAsset()`);

    let asset = 0;
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
    for (const order of this.orders) {
      if (order.orderType === '賣出') {
        const companyData = localCompanies.find((x) => {
          return (x.companyId === order.companyId);
        });
        //以參考價計算賣單股票價值, 如果找不到資料則用賣單價格
        const price = (companyData !== undefined) ? companyData.price : order.unitPrice;
        asset += price * (order.amount - order.done);
      }
    }

    console.log(`---end computeSellOrdersAsset(): ${asset}`);

    return asset;
  }

  //Override
  computeTotalWealth() {
    const totalWealth = super.computeTotalWealth() +
      this.computeBuyOrdersMoney() + this.computeSellOrdersAsset();

    return totalWealth;
  }
}


class Company {
  /**
   * CompanyObject
   * @param {object} serverCompany 從dbCompanies中擷取出來的單一個company
   */
  constructor(serverCompany) {
    this.companyId = serverCompany._id;
    this.name = serverCompany.companyName;

    this.chairman = serverCompany.chairman;
    this.manager = serverCompany.manager;

    this.grade = serverCompany.grade;
    this.capital = serverCompany.capital;
    this.price = serverCompany.listPrice;
    this.release = serverCompany.totalRelease;
    this.profit = serverCompany.profit;

    this.vipBonusStocks = 0; //外掛獨有參數
    this.managerProfitPercent = 0.05; //未來會有的

    this.salary = serverCompany.salary;
    this.nextSeasonSalary = serverCompany.nextSeasonSalary;
    this.bonus = serverCompany.seasonalBonusPercent;
    this.employeesNumber = 0;
    this.nextSeasonEmployeesNumber = 0;

    this.tags = serverCompany.tags;
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
      this.bonus = companyData.bonus;
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
      managerProfitPercent: this.managerProfitPercent,

      salary: this.salary,
      nextSeasonSalary: this.nextSeasonSalary,
      bonus: this.bonus,
      employeesNumber: this.employeesNumber,
      nextSeasonEmployeesNumber: this.nextSeasonEmployeesNumber,

      tags: this.tags,
      createdAt: this.createdAt
    };
  }
}

class Companies {
  /**
   * Company的集合，會創建多個company放在裡面
   */
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
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
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
          managerProfitPercent: 0.05,

          salary: 1000,
          nextSeasonSalary: 1000,
          bonus: 5,
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
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
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

/****************class****************/
/*************************************/
/*************************************/
/*************companyList*************/

class CompanyListController extends EventController {
  /**
   * @param {LoginUser} loginUser 登入中的使用者
   */
  constructor(loginUser) {
    super('CompanyListController', loginUser);

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

/*************companyList*************/
/*************************************/
/*************************************/
/************companyDetail************/

class CompanyDetailController extends EventController {
  /**
   * @param {LoginUser} loginUser 登入中的使用者
   */
  constructor(loginUser) {
    super('CompanyDetailController', loginUser);

    this.whoFirst = null;
    this.loaded = null;
    this.templateListener(Template.companyDetail, 'Template.companyDetail', () => {
      this.useCompaniesInfo();
    });
    this.templateListener(Template.companyDetailContentNormal, 'Template.companyDetailContentNormal', () => {
      this.useEmployeesInfo();
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
}

/************companyDetail************/
/*************************************/
/*************************************/
/*************accountInfo*************/

class AccountInfoController extends EventController {
  /**
   * @param {LoginUser} loginUser 登入中的使用者
   */
  constructor(loginUser) {
    super('AccountInfoController', loginUser);
    this.accountInfoView = new AccountInfoView();

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
  }

  usersEvent() {
    console.log(`start usersEvent()`);

    this.userId = FlowRouter.getParam('userId');
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
}

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
}

/*************accountInfo*************/
/*************************************/
/*************************************/
/**************scriptVIP**************/

class ScriptVipController {
  /**
   * ScriptVip頁面的Controller
   * @param {LoginUser} loginUser 登入中的使用者
   */
  constructor(loginUser) {
    this.loginUser = loginUser;
  }
}

class SearchTables {
  /**
   * 操縱搜尋表的物件
   */
  constructor() {
    this.tables = [];
    this.loadFromLocalstorage();
  }

  updateToLocalstorage() {
    window.localStorage.setItem('localSearchTables', JSON.stringify(this.tables));
  }
  loadFromLocalstorage() {
    this.tables = JSON.parse(window.localStorage.getItem('localSearchTables')) || [];
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
    const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
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
    const chairman = company.chairman;
    const manager = company.manager;

    const grade = company.grade;
    const capital = company.capital;
    const price = company.price;
    const stock = company.release;
    const release = company.release;
    const profit = company.profit;

    const vipBonusStocks = company.vipBonusStocks;
    const managerProfitPercent = company.managerProfitPercent;

    const salary = company.salary;
    const nextSeasonSalary = company.nextSeasonSalary;
    const bonus = company.bonus;
    const employeesNumber = company.employeesNumber;
    const nextSeasonEmployeesNumber = company.nextSeasonEmployeesNumber;

    const tags = company.tags;
    const createdAt = company.createdAt;

    debugConsole('=====do=' + fun);

    return eval(fun);
    /* eslint-enable no-eval, no-unused-vars */
  }
}

/**************scriptVIP**************/
/*************************************/
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
      updateScript: '更新外掛'
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
      estimatedProductVotingRewards: '預估推薦票獎勵：'
    }
  },
  en: {
    script: {
      updateScript: 'update Script'
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
      estimatedProductVotingRewards: 'Estimated Product Voting Rewards：'
    }
  }
};
