import { EventController } from '../Global/EventController';
import { LogRecorder } from '../BigLog/LogRecorder';
import { BigLogView } from '../BigLog/BigLogView';
import { translation } from '../Language/language';
import { getLocalCompanies } from '../functions/getLocalCompanies';
import { earnPerShare } from '../functions/earnPerShare';
import { effectiveStocks } from '../functions/effectiveStocks';
import { User } from '../User/User';
import { AccountInfoView } from './AccountInfoView';

/**
 * AccountInfo的Controller
 */
export class AccountInfoController extends EventController {
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
      translation(['company', 'capital']),
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
        row.push(companyData.capital);
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
