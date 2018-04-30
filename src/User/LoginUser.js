import { User } from './User';
import { ScriptVip } from './ScriptVip';
import { dbDirectors, dbOrders } from '../require';
import { getLocalCompanies } from '../functions/getLocalCompanies';

/**
 * 目前登入中的使用者
 */
export class LoginUser extends User {
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
