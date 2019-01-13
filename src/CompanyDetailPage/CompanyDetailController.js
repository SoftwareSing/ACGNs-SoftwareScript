import { EventController } from 'Global/EventController';
import { LogRecorder } from 'BigLog/LogRecorder';
import { BigLogView } from 'BigLog/BigLogView';
import { Companies } from 'Company/Companies';

/**
 * CompanyDetail的Controller
 */
export class CompanyDetailController extends EventController {
  /**
   * 建構 CompanyDetailController
   * @param {LoginUser} loginUser 登入中的使用者
   */
  constructor(loginUser) {
    super('CompanyDetailController', loginUser);

    this.logRecorder = new LogRecorder();
    this.bigLogView = new BigLogView('companyBigLog');

    this.whoFirst = null;
    this.loaded = null;
    this.templateListener(Template.companyDetail, 'Template.companyDetail', () => {
      this.useCompaniesInfo();
    });
    this.templateListener(Template.companyDetailNormalContent, 'Template.companyDetailNormalContent', () => {
      this.useEmployeesInfo();
    });
    this.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', () => {
      this.useUserOwnedProductsInfo();
    });
    this.templateListener(Template.companyLogList, 'Template.companyLogList', () => {
      this.useLogInfo();
    });

    Template.companyDetailTable.onRendered(() => {
      this.bigLogView.showBigLogFolder();
    });
    this.panelFolderListener('companyDetail_companyBigLog', () => {
      const state = $(`a[data-key='companyDetail_companyBigLog']`).find(`i[class='fa fa-folder-open']`);
      if (state.length > 0) {
        const detailId = FlowRouter.getParam('companyId');
        let localLog = this.logRecorder.find('companyId', detailId);
        localLog = this.logRecorder.sort(localLog);
        this.bigLogView.displayBigLog(localLog);
      }
    });
  }

  useCompaniesInfo() {
    console.log(`start useCompaniesInfo()`);

    this.companies = new Companies();
    this.companies.companyPatch();

    const detailId = FlowRouter.getParam('companyId');
    if ((this.whoFirst === 'employees') && (this.loaded === detailId)) {
      //這個比較慢執行，employees資料已經載入完成了
      this.companies.updateEmployeesInfo();
      this.companies.updateToLocalstorage();
      this.whoFirst = null;
      this.loaded = null;
    }
    else {
      this.whoFirst = 'companies';
      this.loaded = detailId;
    }

    console.log(`end useCompaniesInfo()`);
  }

  useEmployeesInfo() {
    console.log(`start useEmployeesInfo`);

    const detailId = FlowRouter.getParam('companyId');
    if ((this.whoFirst === 'companies') && (this.loaded === detailId)) {
      //這個比較慢執行，companies已經建好了
      this.companies.updateEmployeesInfo();
      this.companies.updateToLocalstorage();
      this.whoFirst = null;
      this.loaded = null;
    }
    else {
      this.whoFirst = 'employees';
      this.loaded = detailId;
    }

    console.log(`end useEmployeesInfo()`);
  }

  useUserOwnedProductsInfo() {
    this.loginUser.updateProducts();
  }

  useLogInfo() {
    this.logRecorder.recordServerLog();
  }
}
