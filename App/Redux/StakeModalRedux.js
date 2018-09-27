import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  openStakeModal: null,
  closeStakeModal: null,

  stakeModalRequest: ['data'],
  stakeModalSuccess: ['payload'],
  stakeModalFailure: null
})

export const StakeModalTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  modalIsOpen: false,
  loading: false,

  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const StakeModalSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

export const openStakeModal = (state) =>
  state.merge({modalIsOpen: true})

export const closeStakeModal = (state) =>
  state.merge({modalIsOpen: false})

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
  [Types.OPEN_STAKE_MODAL]: openStakeModal,
  [Types.CLOSE_STAKE_MODAL]: closeStakeModal,

  [Types.STAKE_MODAL_REQUEST]: request,
  [Types.STAKE_MODAL_SUCCESS]: success,
  [Types.STAKE_MODAL_FAILURE]: failure
})
