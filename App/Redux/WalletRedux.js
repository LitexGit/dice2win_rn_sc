import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  initWallet: null,
  newWallet: null,
  saveWallet: ['data'],
  encryptWallet: ['data'],
  unlockWallet: ['data'],
  setKeystore: ['keystore'],
  setBalance: ['data'],
  setTx: ['data'],
  transfer: ['data'],
  getRandom: ['data'],
  placeBet: ['data'],
  importFromMnemonic: ['data'],
  importEncryptWallet: ['data'],
  setWallet: ['wallet'],
  walletRequest: ['data'],
  walletSuccess: ['payload'],
  walletFailure: ['payload']
})

export const WalletTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  keystore: '',
  tx: {hash: ''},
  wallet: {wallet: {mnemonic: null}},
  data: null,
  fetching: null,
  address: '',
  balance: '',
  payload: null,
  error: null,
  gasPrice: 3e9,
  secret: {}

})

/* ------------- Selectors ------------- */

export const WalletSelectors = {
  getWallet: state => state.wallet,
  getSecret: state => state.wallet.secret,
  getAddress: state => state.wallet.address,
}

/* ------------- Reducers ------------- */

export const setWallet = (state, {wallet}) =>
  // console.tron.log('setWallet', wallet)
  state.merge({wallet})
  // console.log(state.wallet)

export const setTx = (state, {tx}) =>
  state.merge({tx})

export const setBalance = (state, {balance}) =>
  state.merge({balance})

export const setKeystore = (state, {keystore}) =>
  state.merge({keystore})

// request the data from an api
export const request = (state, {data}) =>
  state.merge({fetching: true, data, payload:null })

// successful api lookup
export const success = (state, action) => {
  return state.merge({fetching: false, error: null, ...action.payload})
}

// Something went wrong somewhere.
export const failure = (state, action) => {
  return state.merge({ fetching: false, error: true, payload: { address: '', balance: '' }, ...action.payload })
}



/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_WALLET]: setWallet,
  [Types.SET_KEYSTORE]: setKeystore,
  [Types.SET_TX]: setTx,
  [Types.SET_BALANCE]: setBalance,
  [Types.WALLET_REQUEST]: request,
  [Types.WALLET_SUCCESS]: success,
  [Types.WALLET_FAILURE]: failure
})
