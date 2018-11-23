
const getMaxBet = (maxWin = 2, winRate, edge = 0.01) => {
  // return maxWin / ((1 - edge) * (1 / winRate) - 1);
  return 1.00;
}

module.exports = {
  getMaxBet,
}
