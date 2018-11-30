import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import abi from '../Config/abi';
import Config from 'react-native-config';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  configRequest: ['data'],
  configSuccess: ['payload'],
  socketInit: ['address'],
  socketStatus: ['socket'],
  configFailure: null
})

export const ConfigTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const base_domain = Config.BASE_DOMAIN;

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  socket: 'off',

  base_domain: base_domain,
  base_etherscan: "https://ropsten.etherscan.io/tx/",
  ws: base_domain+':7001',
  // ws: 'http://192.168.51.137:7001',
  // base_domain: "http://192.168.51.137:7001",
  contract_address: "0x3d392560290a746542Cb14429E9ED2898aa74464",
  partnerAddress: "0x633177eeE5dB5a2c504e0AE6044d20a9287909f9",
  network: 'rinkeby',
  trackId: 'UA-127960812-1',
  abi: abi,
  api_list: {
    get_abi: base_domain+"/api/v1/games/dev/abi",
    put_deviceinfo: base_domain+"/api/v1/games/dev/deviceinfo",
    put_random: base_domain+"/api/v1/games/dev/random",
    put_blockchain: base_domain+"/api/v1/games/dev/blockchain",
    get_bet_history: base_domain+"/api/v1/games/dev/bet/history",
    get_jackpot: base_domain+"/api/v1/games/dev/jackpot",
    get_24h_top: base_domain+"/api/v1/games/dev/24h",
    put_user: base_domain+"/api/v1/games/dev/member",
    get_user_list: base_domain+"/api/v1/games/dev/member",
    get_earning_list: base_domain+"/api/v1/games/dev/earning",
    pit_withdraw: base_domain+"/api/v1/games/dev/withdraw"
  },
  telegroup:'tg://resolve/?domain=ftc_shades',
  faq: 'http://litex.io',
  maxWin: 5,
  minBet: 0.01,
  edge: 0.01,
  shareInfo:{
    message:'ETH 4 FUN! \n shared from app',
    link: 'https://eth4.fun',
    title: 'share to friends and get bonus'
  },

  error: null
})

/* ------------- Selectors ------------- */

export const ConfigSelectors = {
  getConfig: state => state.config,
  getMaxWin: state => state.config.maxWin,
  getMinBet: state => state.config.minBet,
  getEdge: state => state.config.edge,
}

/* ------------- Reducers ------------- */

// update socket status
export const socketStatus = (state, { socket }) =>
  state.merge({socket})

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data, payload: null })

// successful api lookup
export const success = (state, action) => {
  // let payload = {...state.payload, ...action.payload}
  let payload = { ...action.payload }

  return state.merge({ fetching: false, error: null, ...payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SOCKET_STATUS]: socketStatus,
  [Types.CONFIG_REQUEST]: request,
  [Types.CONFIG_SUCCESS]: success,
  [Types.CONFIG_FAILURE]: failure
})
