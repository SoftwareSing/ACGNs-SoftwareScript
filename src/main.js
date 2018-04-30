import { translation } from './Language/language';
import { MainController } from './Global/MainController';

// ==UserScript==
// @name         ACGN-stock營利統計外掛
// @namespace    http://tampermonkey.net/
// @version      5.08.01
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
//本腳本修改自 'ACGN股票系統每股營利外掛 2.200 by papago89'


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
