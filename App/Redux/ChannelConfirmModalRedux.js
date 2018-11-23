import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openChannelConfirmModal: ['data'],
  closeChannelConfirmModal: null,

  setChannelAmount: ['channelAmount'],

  channelConfirmModalRequest: ['data'],
  channelConfirmModalSuccess: ['payload'],
  channelConfirmModalFailure: null,
  confirmChangeText:["data"],
})

export const ChannelConfirmModalTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  modalIsOpen: false,
  channelAmount: 0,

  channelConfirmedActions: null,
  channelCanceledActions: null,

  data: null,
  fetching: null,
  payload: null,
  error: null,
  amount:0.01,
})

/* ------------- Selectors ------------- */

export const ChannelConfirmModalSelectors = {
  getData: state => state.data,
  getChannelAmount: state => state.channelConfirmModal.channelAmount
}

/* ------------- Reducers ------------- */

export const confirmChangeText = (state, {data}) => {
  return state.merge({amount:data});
  }

export const setChannelAmount = (state, { channelAmount }) =>
  state.merge({ channelAmount })

export const openChannelConfirmModal = (state, action) =>
  state.merge({modalIsOpen: true, ...action.data})

export const closeChannelConfirmModal = (state) =>
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
  [Types.OPEN_CHANNEL_CONFIRM_MODAL]: openChannelConfirmModal,
  [Types.CLOSE_CHANNEL_CONFIRM_MODAL]: closeChannelConfirmModal,
  [Types.SET_CHANNEL_AMOUNT]: setChannelAmount,

  [Types.CHANNEL_CONFIRM_MODAL_REQUEST]: request,
  [Types.CHANNEL_CONFIRM_MODAL_SUCCESS]: success,
  [Types.CHANNEL_CONFIRM_MODAL_FAILURE]: failure,
  [Types.CONFIRM_CHANGE_TEXT]: confirmChangeText,
})
