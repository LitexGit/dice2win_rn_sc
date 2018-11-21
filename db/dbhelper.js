/**
 * DB Objects
 * 1. channel
 * 2. payment
 * 3. transfer
 * 4. bet
 *
 */
class DBHelper {
  addChannel(channel) {}
  updateChannel(channelId, newAttr) {}
  deleteChannel(channelId) {}
  getChannels(condition, offset, limit) { }
  getChannel(channelId) {}

  addPayment(payment) {}
  getPayments(condition, offset, limit) {}

  addTransfer(transfer) {}
  updateTransfer(transferId, newAttr) {}
  deleteTransfer(transferId) {}
  getTransfer(transferId) {}
  getLatestTransfer(where) {}

  addBet(bet) {}
  updateBet(betId, newAttr) {}
  getBets(condition, offset, limit) {}
  getBet(betId) {}
  getBetByChannel(where) {}
  getLatestRound(channelId) {}
}

module.exports = DBHelper;
