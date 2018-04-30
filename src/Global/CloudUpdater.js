import { debugConsole } from '../functions/debugConsole';
import { ScriptAd } from './ScriptAd';

/**
 * 用來連線雲端以更新資料
 */
export class CloudUpdater {
  /**
   * 建構CloudUpdater
   * @param {*} serverType 現在連的股市伺服器
   */
  constructor(serverType) {
    this.serverType = serverType;

    const myVersion = GM_info.script.version; // eslint-disable-line camelcase
    this.version = Number(myVersion.substr(0, 4));
  }

  /**
   * 以非同步方式取得另外整理過的公司資料 json
   * @param {String} url 資料的網址
   * @return {function} 可以用來更新資料的function
   */
  getWebData(url) {
    let webObjCache = null;

    const webUrl = String(url);
    const request = new XMLHttpRequest();
    request.open('GET', webUrl); // 非同步 GET
    request.addEventListener('load', () => {
      debugConsole('got webData');
      try {
        webObjCache = JSON.parse(request.responseText);
      }
      catch (err) {
        webObjCache = request.responseText;
      }
    });
    request.send();

    return (callback) => {
      // 若快取資料存在，則直接回傳快取
      if (webObjCache !== null) {
        callback(webObjCache);

        return;
      }

      // 若無快取資料，則加入事件監聽，等載入後再回傳資料
      request.addEventListener('load', function() {
        callback(webObjCache);
      });
    };
  }

  checkUpdateTime(url, localUpdateTime, updater) {
    const cloud = this.getWebData(url);
    cloud((cloudInfo) => {
      const cloudTime = cloudInfo.updateTime;
      const conformedVersion = Number(cloudInfo.conformedVersion);
      console.log(`cloud url: ${url}`);
      console.log(`${localUpdateTime} === ${cloudTime}: ${localUpdateTime === cloudTime}`);
      console.log(`${this.version} >= ${conformedVersion}: ${this.version >= conformedVersion}`);
      if (cloudTime === localUpdateTime) {
        console.log(`cloud don't have new data`);
        console.log('');
      }
      else if (this.version >= conformedVersion) {
        console.log(`cloud have new data`);
        console.log('');
        updater(cloudTime);
      }
      else {
        console.log(`script version(${this.version}) is too old, can not update`);
        console.log(`cloud data only supports version ${conformedVersion} or later`);
        console.log('');
      }
    });
  }

  checkCompaniesUpdate() {
    let timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptCompany/updateInfo.json';
    let dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptCompany/companies.json';
    if (this.serverType === 'museum') {
      dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-museum/script/company/companys.json';
      timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-museum/script/company/updateTime.json';
    }

    const updater = (cloudTime) => {
      const cloud = this.getWebData(dataUrl);
      cloud((cloudData) => {
        const inputData = cloudData || [];
        window.localStorage.setItem('localCompanies', JSON.stringify(inputData));
        const inputTime = cloudTime || 'null';
        window.localStorage.setItem('localCompaniesUpdateTime', JSON.stringify(inputTime));

        console.log(`localCompanies update complete`);
      });
    };
    const localCompaniesUpdateTime = JSON.parse(window.localStorage.getItem('localCompaniesUpdateTime')) || 'null';
    this.checkUpdateTime(timeUrl, localCompaniesUpdateTime, updater);
  }

  checkScriptAdUpdate() {
    const timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptAD/updateInfo.json';
    const dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptAD/AD.json';

    const updater = (cloudTime) => {
      const cloud = this.getWebData(dataUrl);
      cloud((cloudData) => {
        const inputData = cloudData || [];
        window.localStorage.setItem('localScriptAd', JSON.stringify(inputData));
        const inputTime = cloudTime || 'null';
        window.localStorage.setItem('localScriptAdUpdateTime', JSON.stringify(inputTime));

        const scriptAd = new ScriptAd();
        scriptAd.removeScriptAd();
        scriptAd.displayScriptAd();

        console.log(`scriptAd update complete`);
      });
    };
    const localScriptAdUpdateTime = JSON.parse(window.localStorage.getItem('localScriptAdUpdateTime')) || 'null';
    this.checkUpdateTime(timeUrl, localScriptAdUpdateTime, updater);
  }

  checkScriptVipProductsUpdate() {
    const timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptVIP/updateInfo.json';
    const dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptVIP/scriptVipProducts.json';

    const updater = (cloudTime) => {
      const cloud = this.getWebData(dataUrl);
      cloud((cloudData) => {
        const inputData = cloudData || [];
        const localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
        const defaultUser = {
          userId: 'default',
          products: inputData
        };
        const j = localScriptVipProducts.findIndex((x) => {
          return (x.userId === defaultUser.userId);
        });
        if (j === -1) {
          localScriptVipProducts.push(defaultUser);
        }
        localScriptVipProducts.forEach((user, i, array) => {
          array[i].products = inputData;
        });

        window.localStorage.setItem('localScriptVipProducts', JSON.stringify(localScriptVipProducts));


        const inputTime = cloudTime || 'null';
        window.localStorage.setItem('localScriptVipProductsUpdateTime', JSON.stringify(inputTime));

        console.log(`scriptVipProducts update complete`);
      });
    };
    const localScriptVipProductsUpdateTime = JSON.parse(window.localStorage.getItem('localScriptVipProductsUpdateTime')) || 'null';
    this.checkUpdateTime(timeUrl, localScriptVipProductsUpdateTime, updater);
  }
}
