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
//{"adLinkType": ["_self", "_blank"],
// "adLink": ["/company/detail/NJbJuXaJxjJpzAJui", "https://www.google.com.tw/"],
// "adData": ["&nbsp;message&nbsp;", "miku"],
// "adFormat": ["a", "aLink"]}

//local_CsDatas_UpdateTime        local
//date

//local_CsDatas規格               local
//{"companyID": String, "companyName": String,
// "companyPrice": Number, "companyStock": Number, "companyProfit": Number,
// "companySalary": Number, "companyNextSeasonSalary": Number, "companyBonus": Number,
// "companyEmployeesNumber": Number, "companyNextSeasonEmployeesNumber": Number}

//userStcokInfo的格式         session
//{"userID": "CWgfhqxbrJMxsknrb",
// "userCompany": [{"companyID": aaa, "userHold": number}, {}]
// "userManage": [{"companyID": aaa}, {}]
// "userEmployee": {"companyID": aaa} }


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

/**************function***************/
/*************************************/
/*************************************/
/*********ACGNListenerScript**********/
