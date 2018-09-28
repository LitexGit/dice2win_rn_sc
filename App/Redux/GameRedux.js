import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

let BN = require('bn.js')

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setStake: ['stake'],
  addUnit: null,
  rmUnit: null,
  setGameKey: ['key'],
  gameRequest: ['data'],
  gameSuccess: ['payload'],
  gameFailure: null
})

export const GameTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  key: 0,
  stake: '0.10',
  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const GameSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const addUnit = state => {
  let stake = (parseFloat(state.stake) + 0.01).toFixed(2)
  return state.merge({stake})
}

export const rmUnit = state => {
  if(parseFloat(state.stake) <= 0.01)
    return state
  let stake = parseFloat(state.stake - 0.01).toFixed(2)
  let reward = stake * state.rewardTime
  return state.merge({stake, reward})
}

export const setStake = (state, action) => {
  const {stake} = action
  return state.merge({stake})
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
  return state.merge({fetching: false, error: null, payload})
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({fetching: false, error: true, payload: null})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_GAME_KEY]: setGameKey,
  [Types.SET_STAKE]: setStake,
  [Types.ADD_UNIT]: addUnit,
  [Types.RM_UNIT]: rmUnit,
  [Types.GAME_REQUEST]: request,
  [Types.GAME_SUCCESS]: success,
  [Types.GAME_FAILURE]: failure
})
