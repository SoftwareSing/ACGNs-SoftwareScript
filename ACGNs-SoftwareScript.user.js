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
  if (debugMode)
    console.log(msg);
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

//監聽MongoDB是否載入完成，載入後執行callback
//範例:
// Template.companyDetailContentNormal.onRendered(() => {
//   const DbEmpListener = new DbListener(dbEmployees);
//   const instance = Template.instance();
//   instance.autorun(() => {
//     DbEmpListener.addMongodbListener(() => {
//       console.log(dbEmployees.find().fetch());
//     });
//   });
// });
class DbListener {
  constructor(dbName) {
    this.lastDb = null;
    this.lastTime = new Date();
    this.dbName = dbName;

    this.waitTime = 500; //如果0.5秒後資料沒有變動，才執行

    this.doCount = 0;
    this.doMax = 200; //當超過200次都獲取到空陣列，判斷為真的空陣列
    this.url = null;
  }

  addMongodbListener(callback, redo) {
    if ((this.doCount > 0) && (! redo)) {
      //已經有相同的listener在執行，不再重複觸發
      //強制跳出

      return;
    }
    this.doCount += 1;

    const currentUrl = document.location.href;
    if (this.url === null) {
      this.url = currentUrl;
    }
    else if (this.url !== currentUrl) {
      //使用者換頁了，強制跳出
      this.url = null;
      this.doCount = 0;

      return;
    }

    const thisDb = (this.dbName).find().fetch();
    const listenTime = new Date();
    if (thisDb.length === 0) {
      //大小為0，理所當然還沒載入
      if (this.doCount < this.doMax) {
        this.lastTime = listenTime;
        setTimeout(() => {
          this.addMongodbListener(callback, true);
        }, 10);
      }
      else {
        //空陣列太多次，判斷為真的空陣列
        //執行callback
        this.url = null;
        this.doCount = 0;

        callback();
      }
    }
    else if (JSON.stringify(this.lastDb) !== JSON.stringify(thisDb)) {
      //資料有變動，代表資料可能還在加載中，重新確認
      this.lastDb = thisDb;
      this.lastTime = listenTime;
      setTimeout(() => {
        this.addMongodbListener(callback, true);
      }, 10);
    }
    else if ((listenTime.getTime() - this.lastTime.getTime()) < this.waitTime) {
      //小於等待時間，資料可能還會變動，重新確認
      setTimeout(() => {
        this.addMongodbListener(callback, true);
      }, 10);
    }
    else {
      //執行callback
      this.url = null;
      this.doCount = 0;
      callback();
    }
  }
}

/**************function***************/
/*************************************/
/*************************************/
/*********ACGNListenerScript**********/
