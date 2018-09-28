import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openNewPwdModal: null,
  closeNewPwdModal: null,
  setPwd: ['pwd'],

  newPwdRequest: ['data'],
  newPwdSuccess: ['payload'],
  newPwdFailure: null
})

export const NewPwdTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  modalIsOpen: false,
  pwd: '',
  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const NewPwdSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const openNewPwdModal = (state) =>
  state.merge({modalIsOpen: true})

export const closeNewPwdModal = (state) =>
  state.merge({modalIsOpen: false})

export const setPwd = (state, acton) =>
  state.merge({pwd: acton.pwd})

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

  [Types.OPEN_NEW_PWD_MODAL]: openNewPwdModal,
  [Types.CLOSE_NEW_PWD_MODAL]: closeNewPwdModal,
  [Types.SET_PWD]: setPwd,

  [Types.NEW_PWD_REQUEST]: request,
  [Types.NEW_PWD_SUCCESS]: success,
  [Types.NEW_PWD_FAILURE]: failure
})
