import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openMessageBox: ['data'],
  closeMessageBox: null,
  messageBoxRequest: ['data'],
  messageBoxSuccess: ['payload'],
  messageBoxFailure: null
})

export const MessageBoxTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isOpen: false,
  displayCancel: false,
  title: '',
  message: '',
  submitedActions: null,
  canceledActions: null,

  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const MessageBoxSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const openMessageBox = (state, action) =>
  state.merge({ isOpen: true, ...action.data })


export const closeMessageBox = (state) =>
  state.merge({ isOpen: false, displayCancel: false, title: '', message: '', submitedActions: null, canceledActions: null })


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
  [Types.OPEN_MESSAGE_BOX]: openMessageBox,
  [Types.CLOSE_MESSAGE_BOX]: closeMessageBox,
  [Types.MESSAGE_BOX_REQUEST]: request,
  [Types.MESSAGE_BOX_SUCCESS]: success,
  [Types.MESSAGE_BOX_FAILURE]: failure
})
