/**
 * 計算每股盈餘(包含VIP排他)
 * @param {Company} company 公司物件
 * @return {Number} 每股盈餘
 */
export function earnPerShare(company) {
  let stocksProfitPercent = (1 -
    (company.managerBonusRatePercent / 100) -
    (company.capitalIncreaseRatePercent / 100) -
    (Meteor.settings.public.companyProfitDistribution.incomeTaxRatePercent / 100)
  );
  if (company.employeesNumber > 0) {
    stocksProfitPercent -= (company.employeeBonusRatePercent / 100);
    stocksProfitPercent -= (Meteor.settings.public.companyProfitDistribution.employeeProductVotingRewardRatePercent / 100);
  }

  return ((company.profit * stocksProfitPercent) / (company.release + company.vipBonusStocks));
}
