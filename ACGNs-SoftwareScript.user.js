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

//版本號為'主要版本號 + "." + 次要版本號 + 錯誤修正版本號，ex 8.31.39
//修復導致功能失效的錯誤或更新重大功能提升主要或次要版本號
//優化UI，優化效能，優化小錯誤更新錯誤版本號
//本腳本修改自 "ACGN股票系統每股營利外掛 2.200 by papago89"


//這邊記一下每個storage的格式

//local_scriptAD_UpdateTime       local
//date

//local_scriptAD                  local
//{adLinkType: ["_self", "_blank"],
// adLink: ["/company/detail/NJbJuXaJxjJpzAJui", "https://www.google.com.tw/"],
// adData: ["&nbsp;message&nbsp;", "miku"],
// adFormat: ["a", "aLink"]}

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
//{userId: "CWgfhqxbrJMxsknrb",
// holdStocks: [{companyId: aaa, stocks: Number, vip: Number}, {}],
// managers: [{companyId: aaa}, {}],
// employee: "aaa",
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

const { getCurrentSeason, getInitialVoteTicketCount } = require("./db/dbSeason");
const {alertDialog} = require("./client/layout/alertDialog.js");

/***************import****************/
/*************************************/
/*************************************/
/************GlobalVariable***********/

//會跨2區以上使用的全域變數放在這裡
//如從stockSummary跨到accountInfo用的變數

let serverType = "normal";

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
//     super("CompanyDetailController", user);
//     this.templateListener(Template.companyDetailContentNormal, "Template.companyDetailContentNormal", this.startEvent);
//     this.templateListener(Template.companyDetail, "Template.companyDetail", this.startEvent2);
//   }
//   startEvent() {
//     console.log("companyDetailContentNormal success");
//     console.log(Meteor.connection._mongo_livedata_collections.employees.find().fetch());
//     console.log("");
//   }
//   startEvent2() {
//     console.log("companyDetail success");
//     console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
//     console.log("");
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
    const name = options.name || "defaultName";
    const customSetting = options.customSetting || "";
    const leftText = options.leftText || "";
    const rightText = options.rightText || "";

    const r = $(`
      <div class="media company-summary-item border-grid-body" name="${name}">
        <div class="col-6 text-right border-grid" name="${name}" id="h2Left">
          <h2 name="${name}" id="h2Left" ${customSetting}>${leftText}</h2>
        </div>
        <div class="col-6 text-right border-grid" name="${name}" id="h2Right">
          <h2 name="${name}" id="h2Right" ${customSetting}>${rightText}</h2>
        </div>
      </div>
    `);

    return r;
  }
  createTable(options) {
    const name = options.name || "defaultName";
    const customSetting = {
      table: options.customSetting.table || "",
      tHead: options.customSetting.tHead || "",
      tBody: options.customSetting.tBody || ""
    };
    const tHead = options.tHead || [];
    const tBody = options.tBody || [];

    let head = "";
    head += `<tr>`;
    for (const h of tHead) {
      head += `<th name=${name} ${customSetting.tHead}>${h}</th>`;
    }
    head += `</tr>`;

    let body = "";
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
    const name = options.name || "defaultName";
    const customSetting = options.customSetting || "";
    const size = options.size || "btn-sm";
    const color = options.color || "btn-info";
    const text = options.text || "default";

    const r = $(`
      <button class="btn ${color} ${size}" name="${name}" ${customSetting}>${text}</button>
    `);

    return r;
  }
  createSelect(options) {
    const name = options.name || "defaultName";
    const customSetting = options.customSetting || "";

    const r = $(`
      <select class="form-control" name="${name}" ${customSetting}>
      </select>
    `);

    return r;
  }
  createSelectOption(options) {
    const name = options.name || "defaultName";
    const customSetting = options.customSetting || "";
    const text = options.text || "defaultText";

    const r = $(`
      <option name="${name}" value="${text}" ${customSetting}>${text}</option>
    `);

    return r;
  }
  createInput(options) {
    const name = options.name || "defaultName";
    const customSetting = options.customSetting || "";
    const defaultValue = options.defaultValue || "";
    const placeholder = options.placeholder || "";
    const type = options.type || "text";

    const r = $(`
      <input class="form-control"
        name="${name}"
        type="${type}"
        placeholder="${placeholder}"
        value="${defaultValue}"
        ${customSetting}
      />
    `);

    return r;
  }
  createA(options) {
    const name = options.name || "defaultName";
    const customSetting = options.customSetting || "";
    const href = options.href ? `href="${options.href}"` : "";
    const target = options.target ? `target="${options.target}"` : "";
    const text = options.text || "";

    const r = $(`
      <a class="float-left"
        name="${name}"
        ${href}
        ${target}
        ${customSetting}
      >${text}</a>
    `);

    return r;
  }
}

/****************class****************/
/*************************************/
/*************************************/
/*********ACGNListenerScript**********/
