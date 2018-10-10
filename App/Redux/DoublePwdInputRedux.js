import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  init: null,
  changePwd1Vis: null,
  changePwd2Vis: null,
  changePwd1Input: ['input'],
  changePwd2Input: ['input'],

  doublePwdInputRequest: ['data'],
  doublePwdInputSuccess: ['payload'],
  doublePwdInputFailure: null
})

export const DoublePwdInputTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  pwd1: '',
  pwd2: '',
  pwd1vis: true,
  pwd2vis: true,

  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const DoublePwdInputSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */
export const init = (state) =>
  state.merge({
    pwd1: '',
    pwd2: '',
    pwd1vis: true,
    pwd2vis: true,
  })

export const changePwd1Vis = (state) =>
  state.merge({pwd1vis: !state.pwd1vis})

export const changePwd2Vis = (state) =>
  state.merge({pwd2vis: !state.pwd2vis})

export const changePwd1Input = (state, action) =>
  state.merge({pwd1: action.input})

export const changePwd2Input = (state, action) =>
  state.merge({pwd2: action.input})

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
  [Types.INIT]: init,
  [Types.CHANGE_PWD1_VIS]: changePwd1Vis,
  [Types.CHANGE_PWD2_VIS]: changePwd2Vis,

  [Types.CHANGE_PWD1_INPUT]: changePwd1Input,
  [Types.CHANGE_PWD2_INPUT]: changePwd2Input,

  [Types.DOUBLE_PWD_INPUT_REQUEST]: request,
  [Types.DOUBLE_PWD_INPUT_SUCCESS]: success,
  [Types.DOUBLE_PWD_INPUT_FAILURE]: failure
})
