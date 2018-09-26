import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  settingRequest: ['data'],
  settingSuccess: ['payload'],
  settingFailure: null
})

export const SettingTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: {msg_noti: true, tx_noti: true, language: 'English'},
  error: null
})

/* ------------- Selectors ------------- */

export const SettingSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data, payload: null })

// successful api lookup
export const success = (state, action) => {
  let { payload } = action
  payload = {...state.payload, ...payload}
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SETTING_REQUEST]: request,
  [Types.SETTING_SUCCESS]: success,
  [Types.SETTING_FAILURE]: failure
})
