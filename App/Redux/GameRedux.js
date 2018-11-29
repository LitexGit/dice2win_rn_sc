import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

let BN = require('bn.js')

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setStake: ['stake'],
  setGameKey: ['key'],
  gameRequest: ['data'],
  gameSuccess: ['payload'],
  gameFailure: null,
  updateBet: ['bet'],
  updateStatus: ['data'],
  refreshStatus: ['data'],
  updateResult: ['result'],
  tenOperation:['data'],
})

export const GameTypes = Types
export default Creators

export const GAME_NAMES = {
  2:'coin',
  6: 'dice1',
  36: 'dice2',
  100: 'roll'
}

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  key: 0,
  stake: 0.10,
  data: null,
  fetching: null,
  payload: null,
  error: null,
  result: {2:{}, 6:{}, 36:{}, 100:{}},
  status: {2:'idle', 6:'idle', 36:'idle', 100:'idle'},
  bet: {2:null, 6:null, 36:null, 100:null},
  isSelectedTen: false,
})

/* ------------- Selectors ------------- */

export const GameSelectors = {
  getData: state => state.data,
  getGameId: state => state.game.key,
  getBet: state => state.game.bet,
  getIsSelectedTen: state => state.game.isSelectedTen,
}

/* ------------- Reducers ------------- */

export const tenOperation = (state, action) => {
  let {isSelectedTen=false} = state;
  isSelectedTen = !isSelectedTen;
  return state.merge({isSelectedTen});
}


export const updateBet = (state, action) => {
  let bet = {...state.bet, ...action.bet}
  return state.merge({bet})
}

export const updateStatus = (state, action) => {
  let {status, hash} = action.data

  let modulo = Object.keys(status)[0]
  if (!!hash && hash != state.bet[modulo]) return state

  status = {...state.status, ...status}
  return state.merge({status, fetching: false})
}

export const refreshStatus = (state, action) =>
  state.merge({fetching: true})


export const updateResult = (state, action) => {
  let result = {...state.result, ...action.result}
  return state.merge({result})
}

export const setGameKey = (state, action) => {
  const {key} = action
  return state.merge({key})
}


// request the data from an api
export const request = (state, {data}) =>
  state.merge({fetching: true, data, payload: null})

// successful api lookup
export const success = (state, action) => {
  const {payload} = action
  return state.merge({fetching: false, error: null, ...payload})
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({fetching: false, error: true, payload: null})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_BET]: updateBet,
  [Types.UPDATE_STATUS]: updateStatus,
  [Types.REFRESH_STATUS]: refreshStatus,
  [Types.UPDATE_RESULT]: updateResult,
  [Types.SET_GAME_KEY]: setGameKey,
  [Types.GAME_REQUEST]: request,
  [Types.GAME_SUCCESS]: success,
  [Types.GAME_FAILURE]: failure,
  [Types.TEN_OPERATION]: tenOperation

})
