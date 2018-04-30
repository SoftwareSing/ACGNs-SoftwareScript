import { EventController } from '../Global/EventController';
import { Companies } from '../Company/Companies';
import { CompanyListView } from './CompanyListView';

/**
 * CompanyList的Controller
 */
export class CompanyListController extends EventController {
  /**
   * 建構 CompanyListController
   * @param {LoginUser} loginUser 登入中的使用者
   */
  constructor(loginUser) {
    super('CompanyListController', loginUser);

    this.companyListView = new CompanyListView(this.loginUser);

    Template.companyListCard.onRendered(() => {
      const instance = Template.instance();
      this.companyListView.addCardInfo(instance);
    });

    this.templateListener(Template.companyList, 'Template.companyList', () => {
      this.updateUserInfo();
      this.useCompaniesInfo();
    });
  }

  updateUserInfo() {
    this.loginUser.updateFullHoldStocks();
    this.loginUser.updateOrders();
  }

  useCompaniesInfo() {
    const companies = new Companies();
    companies.companyPatch();

    companies.updateToLocalstorage();
  }
}
