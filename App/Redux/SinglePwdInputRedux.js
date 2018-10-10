import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { changePwd2Input, changePwd2Vis } from './DoublePwdInputRedux'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  init: null,
  changePwdVis: null,
  changePwdInput: ['input'],

  singlePwdInputRequest: ['data'],
  singlePwdInputSuccess: ['payload'],
  singlePwdInputFailure: null
})

export const SinglePwdInputTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  pwd: '',
  pwdVis: true,

  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const SinglePwdInputSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */
export const init = (state) =>
  state.merge({
    pwd: '',
    pwdVis: true
  })

export const changePwdVis = (state) =>
  state.merge({pwdVis: !state.pwdVis})

export const changePwdInput = (state, action) =>
  state.merge({pwd: action.input})

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
  [Types.CHANGE_PWD_VIS]: changePwdVis,
  [Types.CHANGE_PWD_INPUT]: changePwdInput,

  [Types.SINGLE_PWD_INPUT_REQUEST]: request,
  [Types.SINGLE_PWD_INPUT_SUCCESS]: success,
  [Types.SINGLE_PWD_INPUT_FAILURE]: failure
})
