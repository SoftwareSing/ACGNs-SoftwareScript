export function computeRebate(totalCost) {
  const { divisorAmount, initialDeliverPercent, minDeliverPercent } = Meteor.settings.public.productRebates;
  let rebate = 0;
  for (let i = 1; i * divisorAmount <= totalCost; i += 1) {
    const deliverPercent = Math.max(
      initialDeliverPercent - Math.log10(i) / 7.7 * 100,
      minDeliverPercent
    );
    rebate += divisorAmount * deliverPercent / 100;
  }

  return Math.floor(rebate);
}
