import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openChannelWithdrawModal: ['data'],
  closeChannelWithdrawModal: null,

  channelWithdrawModalRequest: ['data'],
  channelWithdrawModalSuccess: ['payload'],
  channelWithdrawModalFailure: null
})

export const ChannelWithdrawModalTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  modalIsOpen: false,

  withdrawConfirmedActions: null,
  withdrawCanceledActions: null,

  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const ChannelWithdrawModalSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const openChannelWithdrawModal = (state, action) =>
  state.merge({modalIsOpen: true, ...action.data})

export const closeChannelWithdrawModal = (state) => 
  state.merge({...INITIAL_STATE})

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
  [Types.OPEN_CHANNEL_WITHDRAW_MODAL]: openChannelWithdrawModal,
  [Types.CLOSE_CHANNEL_WITHDRAW_MODAL]: closeChannelWithdrawModal,

  [Types.CHANNEL_WITHDRAW_MODAL_REQUEST]: request,
  [Types.CHANNEL_WITHDRAW_MODAL_SUCCESS]: success,
  [Types.CHANNEL_WITHDRAW_MODAL_FAILURE]: failure
})
