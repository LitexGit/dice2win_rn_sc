import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

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
  api: {
    contract_address: "0x3d392560290a746542Cb14429E9ED2898aa74464",
    base_domain: "http://api.eth4.fun",
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
    }
  },
  payload: {
    telegroup:'tg://resolve/?domain=ftc_shades',
    faq: 'http://litex.io',
    shareInfo:{
      message:'ETH 4 FUN! \n shared from app',
      link: 'eth4.fun',
      title: 'share to friends and get bonus'
    },
    ws: 'http://eth4.fun:7001',
  },

  socket: 'off',

  error: null
})

/* ------------- Selectors ------------- */

export const ConfigSelectors = {
  getData: state => state.data
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
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
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
