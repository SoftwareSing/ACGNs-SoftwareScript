import { LoginUser } from 'User/LoginUser';
import { ScriptView } from 'Global/ScriptView';
import { CloudUpdater } from 'Global/CloudUpdater';
import { CompanyListController } from 'CompanyListPage/CompanyListController';
import { CompanyDetailController } from 'CompanyDetailPage/CompanyDetailController';
import { AccountInfoController } from 'AccountInfoPage/AccountInfoController';
import { ScriptVipController } from 'ScriptVipPage/ScriptVipController';
import { getLocalCompanies } from 'functions/getLocalCompanies';
import { translation } from 'Language/language';
import { AboutController } from 'AboutPage/AboutController';
import { DisconnectReminderController } from 'DisconnectReminder/DisconnectReminderController';

export class MainController {
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

    const softwareScriptRoute = FlowRouter.group({
      prefix: '/SoftwareScript',
      name: 'softwareScriptRoute'
    });
    softwareScriptRoute.route('/', {
      name: 'softwareScript',
      action() {
        DocHead.setTitle(`${Meteor.settings.public.websiteName} - ${translation(['script', 'name'])}`);
      }
    });
    softwareScriptRoute.route('/scriptVIP', {
      name: 'softwareScriptVip',
      action() {
        DocHead.setTitle(`${Meteor.settings.public.websiteName} - ${translation(['script', 'name'])} - ${translation(['script', 'vip'])}`);
      }
    });
    softwareScriptRoute.route('/about', {
      name: 'softwareScriptAbout',
      action() {
        DocHead.setTitle(`${Meteor.settings.public.websiteName} - ${translation(['script', 'name'])} - ${translation(['script', 'about'])}`);
      }
    });
    softwareScriptRoute.route('/blankPage', {
      name: 'blankPage',
      action() {
        DocHead.setTitle(`${Meteor.settings.public.websiteName} - blank page`);
      }
    });

    this.scriptView = new ScriptView(this);
    this.scriptView.displayDropDownMenu();
    this.scriptView.displayScriptMenu();

    this.companyListController = new CompanyListController(this.loginUser);
    this.companyDetailController = new CompanyDetailController(this.loginUser);
    this.accountInfoController = new AccountInfoController(this.loginUser);
    this.scriptVipController = new ScriptVipController(this.loginUser);
    this.aboutController = new AboutController(this.loginUser);

    this.disconnectReminderController = new DisconnectReminderController(this.loginUser);
  }

  checkCloudUpdate() {
    const cloudUpdater = new CloudUpdater(this.serverType);
    cloudUpdater.checkCompaniesUpdate();
    cloudUpdater.checkScriptVipProductsUpdate();
  }

  showMostStockholdingCompany() {
    console.log(`start showMostStockholdingCompany()`);

    const max = 30;
    const holdStocks = this.loginUser.findMostStockholdingCompany();
    const list = [];
    const localCompanies = getLocalCompanies();
    let i = 0;
    for (const company of holdStocks) {
      i += 1;
      if (i > max) {
        break;
      }

      const companyData = localCompanies.find((x) => {
        return (x.companyId === company.companyId);
      });
      list.push({
        companyId: company.companyId,
        name: companyData ? companyData.name : '[unknow]'
      });
    }

    this.scriptView.displayMostStockholdingCompany(list);

    console.log(`end showMostStockholdingCompany()`);
  }

  switchDisconnectReminder(disconnectReminderSwitch) {
    window.localStorage.setItem('SoftwareScript.disconnectReminderSwitch', JSON.stringify(disconnectReminderSwitch));
    this.scriptView.displaySwitchDisconnectReminderInfo(disconnectReminderSwitch);
  }
}
