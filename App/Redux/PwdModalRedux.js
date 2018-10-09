import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openPwdModal: ['data'],
  closePwdModal: null,
  setPwd: ['pwd'],
  setErrInfo: ['data'],

  pwdModalRequest: ['data'],
  pwdModalSuccess: ['payload'],
  pwdModalFailure: null
})

export const PwdModalTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  modalIsOpen: false,
  pwd: '',

  // callback actions, format: [{action, data}, ...]
  submitedActions: null,
  canceledActions: null,

  data: null,
  fetching: null,
  payload: null,
  error: null,
  errInfo: null
})

/* ------------- Selectors ------------- */

export const PwdModalSelectors = {
  getData: state => state.data,
  getPassword: state => state.pwdModal.pwd
}

/* ------------- Reducers ------------- */

export const openPwdModal = (state, action) =>
  state.merge({ modalIsOpen: true, errInfo: null, ...action.data })

export const closePwdModal = (state) =>
  state.merge({ modalIsOpen: false, errInfo: null, pwd: '', submitedActions: null, canceledActions: null })

export const setPwd = (state, action) =>
  state.merge({ pwd: action.pwd, errInfo: null })

export const setErrInfo = (state, action) =>
  state.merge({errInfo: action.data.errInfo})

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
  [Types.OPEN_PWD_MODAL]: openPwdModal,
  [Types.CLOSE_PWD_MODAL]: closePwdModal,
  [Types.SET_PWD]: setPwd,
  [Types.SET_ERR_INFO]: setErrInfo,

  [Types.PWD_MODAL_REQUEST]: request,
  [Types.PWD_MODAL_SUCCESS]: success,
  [Types.PWD_MODAL_FAILURE]: failure
})
