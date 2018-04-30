/**
 * 依照股票與vipLV計算有效分紅股票
 * @param {Number} stock 股票數
 * @param {Number} vipLevel vip等級
 * @return {Number} 有效的股票數
 */
export function effectiveStocks(stock, vipLevel) {
  const { stockBonusFactor: vipBonusFactor } = Meteor.settings.public.vipParameters[vipLevel || 0];

  return (stock * vipBonusFactor);
}
