/*************************************/
/**************Language***************/

/**
 * 語言翻譯
 * @param {Array} target 目標語句
 * @return {String} 回傳語句
 */
export function translation(target) {
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
      trunOnDisconnectReminder: '啟用 斷線提醒器',
      trunOffDisconnectReminder: '關閉 斷線提醒器',
      trunOnDisconnectReminderInfo: '您啟用了 斷線提醒器，將在重新載入網頁後生效',
      trunOffDisconnectReminderInfo: '您關閉了 斷線提醒器，將在重新載入網頁後生效',
      showMostStockholdingCompany: '列出最多持股公司',

      bigLog: '大量紀錄',

      disconnectWarningInfo: (dbName, count, stopTime) => {
        dbName = dbName || '某個資料';
        count = count || '多';
        stopTime = stopTime || '數';

        return `您已訪問 ${dbName} 達 ${count} 次！建議休息 ${stopTime} 秒再繼續`;
      }
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
      estimatedStockTax: '預估股票稅金：',
      estimatedMoneyTax: '預估現金稅金：',
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
      trunOnDisconnectReminder: 'trun on DisconnectReminder',
      trunOffDisconnectReminder: 'trun off DisconnectReminder',
      trunOnDisconnectReminderInfo: 'You turned on the DisconnectReminder, it will take effect after reloading the page',
      trunOffDisconnectReminderInfo: 'You turned off the DisconnectReminder, it will take effect after reloading the page',
      showMostStockholdingCompany: 'show most stocks company',

      bigLog: 'Big log',

      disconnectWarningInfo: (dbName, count, stopTime) => {
        dbName = dbName || 'some data';
        count = count || 'many';
        stopTime = stopTime || 'few';

        return `You have accessed ${dbName} up to ${count} times! Recommended rest ${stopTime} seconds before continuing.`;
      }
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
      estimatedStockTax: 'Estimated stock tax：',
      estimatedMoneyTax: 'Estimated money tax：',
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
