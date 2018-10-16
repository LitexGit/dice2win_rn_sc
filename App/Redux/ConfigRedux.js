import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import abi from '../Config/abi'

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

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  socket: 'off',

  base_domain: "http://api.eth4.fun",
  base_etherscan: "https://ropsten.etherscan.io/tx/",
  ws: 'http://eth4.fun:7001',
  // ws: 'http://192.168.51.137:7001',
  // base_domain: "http://192.168.51.137:7001",
  contract_address: "0x3d392560290a746542Cb14429E9ED2898aa74464",
  network: 'ropsten',
  abi: abi,
  api_list: {
    get_abi: "http://api.eth4.fun/api/v1/games/dev/abi",
    put_deviceinfo: "http://api.eth4.fun/api/v1/games/dev/deviceinfo",
    put_random: "http://api.eth4.fun/api/v1/games/dev/random",
    put_blockchain: "http://api.eth4.fun/api/v1/games/dev/blockchain",
    get_bet_history: "http://api.eth4.fun/api/v1/games/dev/bet/history",
    get_jackpot: "http://api.eth4.fun/api/v1/games/dev/jackpot",
    get_24h_top: "http://api.eth4.fun/api/v1/games/dev/24h",
    put_user: "http://api.eth4.fun/api/v1/games/dev/member",
    get_user_list: "http://api.eth4.fun/api/v1/games/dev/member",
    get_earning_list: "http://api.eth4.fun/api/v1/games/dev/earning",
    pit_withdraw: "http://api.eth4.fun/api/v1/games/dev/withdraw"
  },
  telegroup:'tg://resolve/?domain=ftc_shades',
  faq: 'http://litex.io',
  maxWin: 5,
  minBet: 0.01,
  edge: 0.01,
  shareInfo:{
    message:'ETH 4 FUN! \n shared from app',
    link: 'eth4.fun',
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
  if (!!payload.network) W.network = payload.network
  if (!!payload.base_domain) ApiSauceObj.setBaseURL(payload.base_domain)

  console.tron.log(`omg i am now at ${ApiSauceObj.getBaseURL()}`)
  // console.tron.log('omg api is', api)

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
