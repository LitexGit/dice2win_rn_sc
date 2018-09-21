export default {
  // Functions return fixtures
  getRoot: () => {
    return {
      ok: true,
      data: require('../Fixtures/root.json')
    }
  },
  getRate: () => {
    return {
      ok: true,
      data: require('../Fixtures/rateLimit.json')
    }
  },
  getUser: (username) => {
    // This fixture only supports gantman or else returns skellock
    const gantmanData = require('../Fixtures/gantman.json')
    const skellockData = require('../Fixtures/skellock.json')
    return {
      ok: true,
      data: username.toLowerCase() === 'gantman' ? gantmanData : skellockData
    }
  },

  getActivity: () => {
    const bannerData = require('../Fixtures/banner.json')
    return {
      ok: true,
      data: {banners: bannerData}
    }
  },

  getRecord: ({type}) => {
    const recordData = require('../Fixtures/records.json')[type]
    return {
      ok: true,
      data: recordData
    }
  },

  getWallet: () => {
    const walletData = require('../Fixtures/wallet.json')
    return {
      ok: true,
      data: walletData
    }
  }
}
