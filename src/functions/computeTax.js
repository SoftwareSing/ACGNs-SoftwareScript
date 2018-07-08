const taxConfigList = [
  {
    from: 10000,
    to: 100000,
    ratio: 3,
    balance: 300
  },
  {
    from: 100000,
    to: 500000,
    ratio: 6,
    balance: 3300
  },
  {
    from: 500000,
    to: 1000000,
    ratio: 9,
    balance: 18300
  },
  {
    from: 1000000,
    to: 2000000,
    ratio: 12,
    balance: 48300
  },
  {
    from: 2000000,
    to: 3000000,
    ratio: 15,
    balance: 108300
  },
  {
    from: 3000000,
    to: 4000000,
    ratio: 18,
    balance: 198300
  },
  {
    from: 4000000,
    to: 5000000,
    ratio: 21,
    balance: 318300
  },
  {
    from: 5000000,
    to: 6000000,
    ratio: 24,
    balance: 468300
  },
  {
    from: 6000000,
    to: 7000000,
    ratio: 27,
    balance: 648300
  },
  {
    from: 7000000,
    to: 8000000,
    ratio: 30,
    balance: 858300
  },
  {
    from: 8000000,
    to: 9000000,
    ratio: 33,
    balance: 1098300
  },
  {
    from: 9000000,
    to: 10000000,
    ratio: 36,
    balance: 1368300
  },
  {
    from: 10000000,
    to: 11000000,
    ratio: 39,
    balance: 1668300
  },
  {
    from: 11000000,
    to: 12000000,
    ratio: 42,
    balance: 1998300
  },
  {
    from: 12000000,
    to: 13000000,
    ratio: 45,
    balance: 2358300
  },
  {
    from: 13000000,
    to: 14000000,
    ratio: 48,
    balance: 2748300
  },
  {
    from: 14000000,
    to: 15000000,
    ratio: 51,
    balance: 3168300
  },
  {
    from: 15000000,
    to: 16000000,
    ratio: 54,
    balance: 3618300
  },
  {
    from: 16000000,
    to: 17000000,
    ratio: 57,
    balance: 4098300
  },
  {
    from: 17000000,
    to: Infinity,
    ratio: 60,
    balance: 4608300
  }
];

export function computeTax(money) {
  const matchTaxConfig = taxConfigList.find((taxConfig) => {
    return (
      money >= taxConfig.from &&
      money < taxConfig.to
    );
  });
  if (matchTaxConfig) {
    return Math.ceil(money * matchTaxConfig.ratio / 100) - matchTaxConfig.balance;
  }
  else {
    return 0;
  }
}
