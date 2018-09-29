import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  newWallet: null,
  encryptWallet: ['data'],
  setKeystore: ['keystore'],
  setBalance: ['data'],
  setTx: ['data'],
  transfer: ['data'],
  getRandom: ['data'],

  importWallet: ['mnemonic'],
  importEncryptWallet: ['data'],
  setWallet: ['wallet'],
  initWallet: null,
  walletRequest: ['data'],
  walletSuccess: ['payload'],
  walletFailure: null
})

export const WalletTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  keystore: {},
  tx: {hash: ''},
  walletData: {
    address: '',
    balance: ''
  },
  data: null,
  fetching: null,
  payload: {address: '', balance: ''},
  error: null
})

/* ------------- Selectors ------------- */

export const WalletSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const setWallet = (state, {wallet}) =>
  state.merge({wallet})

export const setTx = (state, {tx}) =>
  state.merge({tx})

export const setBalance = (state, {balance}) =>
  state.merge({balance})

export const setKeystore = (state, {keystore}) =>
  state.merge({keystore})

// request the data from an api
export const request = (state, {data}) =>
  state.merge({fetching: true, data })

// successful api lookup
export const success = (state, action) => {
  const {payload} = action
  return state.merge({fetching: false, error: null, payload})
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({fetching: false, error: true, payload: null})

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
