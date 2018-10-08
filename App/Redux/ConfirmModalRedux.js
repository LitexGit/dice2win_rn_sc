import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  openConfirmModal: ['data'],
  closeConfirmModal: null,

  confirmModalRequest: ['data'],
  confirmModalSuccess: ['payload'],
  confirmModalFailure: null
})

export const confirmModalTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({

  modalIsOpen: false,

  amount: 0,
  from: null,
  to: null,
  gas: 0,

  // format: {action, data}
  confirmedActions: null,
  canceledActions: null,

  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const ConfirmModalSelectors = {
  getData: state => state.data,
  getGas: state => state.confirmModal.gas
}

/* ------------- Reducers ------------- */

export const openConfirmModal = (state, action) =>
  state.merge({modalIsOpen: true, ...action.data})

export const closeConfirmModal = (state) =>
  state.merge({modalIsOpen: false, amount: 0, from: null, to: null, gas: 0, confirmedActions: null, canceledActions: null})

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
  [Types.OPEN_CONFIRM_MODAL]: openConfirmModal,
  [Types.CLOSE_CONFIRM_MODAL]: closeConfirmModal,

  [Types.CONFIRM_MODAL_REQUEST]: request,
  [Types.CONFIRM_MODAL_SUCCESS]: success,
  [Types.CONFIRM_MODAL_FAILURE]: failure
})
