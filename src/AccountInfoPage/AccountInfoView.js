import { View } from 'Global/View';
import { translation } from 'Language/language';

/**
 * AccountInfo的View
 */
export class AccountInfoView extends View {
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
      stockTax: false,
      moneyTax: false
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

      $(`div[name='stockTax']`).remove();
      $(`div[name='moneyTax']`).remove();

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

  displayStockTax(stockTax) {
    const displayObject = this.createH2Info({
      name: 'stockTax',
      leftText: translation(['accountInfo', 'estimatedStockTax']),
      rightText: `$ ${stockTax}`
    });

    $(`div[name='stockTax']`).remove();
    const afterObject = this.displayList.hrProfit || this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.stockTax = displayObject;
  }

  displayMoneyTax(moneyTax) {
    const displayObject = this.createH2Info({
      name: 'moneyTax',
      leftText: translation(['accountInfo', 'estimatedMoneyTax']),
      rightText: `$ ${moneyTax}`
    });

    $(`div[name='moneyTax']`).remove();
    const afterObject = this.displayList.hrProfit || this.displayList.hrStocks || $(`h1[class='card-title']`)[0];
    displayObject.insertAfter(afterObject);
    this.displayList.moneyTax = displayObject;
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
