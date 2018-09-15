import { View } from 'Global/View';
import { getLocalCompanies } from 'functions/getLocalCompanies';
import { translation } from 'Language/language';
import { earnPerShare } from 'functions/earnPerShare';
import { effectiveStocks } from 'functions/effectiveStocks';
import { Company } from 'Company/Company';
import { getCurrentUserOwnedStockAmount } from 'require';

/**
 * CompanyList的View
 */
export class CompanyListView extends View {
  /**
   * 建構CompanyListView
   * @param {LoginUser} loginUser LoginUser
   */
  constructor(loginUser) {
    super('CompanyListView');
    this.loginUser = loginUser;

    //強制覆蓋
    Template.companyListCard._callbacks.rendered = [];
  }

  get localCompanies() {
    const nowTime = new Date();
    //避免在短時間內過於頻繁的存取 localStorage
    if (! this.lastGetTime) {
      this.lastGetTime = nowTime;
      this._localCompanies = getLocalCompanies();
    }
    else if ((nowTime.getTime() - this.lastGetTime.getTime()) > 3000) {
      this.lastGetTime = nowTime;
      this._localCompanies = getLocalCompanies();
    }

    return this._localCompanies;
  }

  addCardInfo(instance) {
    function insertAfterLastRow(row) {
      instance.$('.row-info').last()
        .after(row);
    }

    function hideRow(row) {
      row.removeClass('d-flex').addClass('d-none');
    }

    function showRow(row) {
      row.removeClass('d-none').addClass('d-flex');
    }


    const infoRowSample = instance.$('.row-info').last();

    const ownValueRow = infoRowSample.clone();
    ownValueRow.find('p:eq(0)').html(translation(['companyList', 'stockAsset']));
    insertAfterLastRow(ownValueRow);

    const profitRow = infoRowSample.clone();
    profitRow.find('p:eq(0)').html(translation(['company', 'profit']));
    insertAfterLastRow(profitRow);

    const peRatioRow = infoRowSample.clone();
    peRatioRow.find('p:eq(0)').html(translation(['companyList', 'peRatio']));
    insertAfterLastRow(peRatioRow);

    const peRatioVipRow = infoRowSample.clone();
    peRatioVipRow.find('p:eq(0)').html(translation(['companyList', 'peRatioVip']));
    insertAfterLastRow(peRatioVipRow);

    const peRatioUserRow = infoRowSample.clone();
    peRatioUserRow.find('p:eq(0)').html(translation(['companyList', 'peRatioUser']));
    insertAfterLastRow(peRatioUserRow);

    const userProfitRow = infoRowSample.clone();
    userProfitRow.find('p:eq(0)').html(translation(['companyList', 'estimatedProfit']));
    insertAfterLastRow(userProfitRow);

    const managerSalaryRow = infoRowSample.clone();
    managerSalaryRow.find('p:eq(0)').html(translation(['companyList', 'estimatedManagerProfit']));
    insertAfterLastRow(managerSalaryRow);


    instance.autorun(() => {
      const serverCompany = Template.currentData();
      const company = new Company(serverCompany);
      const companyData = this.localCompanies.find((x) => {
        return (x.companyId === company.companyId);
      });
      if (companyData !== undefined) {
        company.updateWithLocalcompanies(companyData);
      }

      profitRow.find('p:eq(1)').html(`$ ${Math.round(company.profit)}`);

      const vipBonusStocks = Number(company.vipBonusStocks);
      company.vipBonusStocks = 0;
      const peRatio = company.price / earnPerShare(company);
      company.vipBonusStocks = vipBonusStocks;
      peRatioRow.find('p:eq(1)').html(isFinite(peRatio) ? peRatio.toFixed(2) : '∞');

      const peRatioVip = company.price / earnPerShare(company);
      peRatioVipRow.find('p:eq(1)').html(isFinite(peRatioVip) ? peRatioVip.toFixed(2) : '∞');


      if (Meteor.user()) {
        const stockAmount = getCurrentUserOwnedStockAmount(company.companyId);
        if (stockAmount > 0) {
          const stockAmount = getCurrentUserOwnedStockAmount(company.companyId);
          const ownValue = stockAmount * company.price;
          ownValueRow.find('p:eq(1)').html(`$ ${ownValue}`);
          showRow(ownValueRow);

          const holdC = this.loginUser.holdStocks.find((x) => {
            return (x.companyId === company.companyId);
          }) || { vip: null };
          const userProfit = Math.round(earnPerShare(company) * effectiveStocks(stockAmount, holdC.vip));
          userProfitRow.find('p:eq(1)').html(`$ ${userProfit}`);
          showRow(userProfitRow);

          const peRatioUser = ownValue / userProfit;
          peRatioUserRow.find('p:eq(1)').html(isFinite(peRatioUser) ? peRatioUser.toFixed(2) : '∞');
          showRow(peRatioUserRow);
        }
        else {
          hideRow(ownValueRow);
          hideRow(userProfitRow);
          hideRow(peRatioUserRow);
        }

        if (Meteor.userId() !== company.manager) {
          hideRow(managerSalaryRow);
        }
        else {
          const managerSalary = Math.round(company.profit * (company.managerBonusRatePercent / 100));
          managerSalaryRow.find('p:eq(1)').html(`$ ${managerSalary}`);
          showRow(managerSalaryRow);
        }
      }
      else {
        hideRow(ownValueRow);
        hideRow(userProfitRow);
        hideRow(managerSalaryRow);
        hideRow(peRatioUserRow);
      }
    });
  }
}
