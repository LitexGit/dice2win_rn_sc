import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initNotification: null,
  notificationRequest: ['data'],
  notificationSuccess: ['payload'],
  notificationFailure: null
})

export const NotificationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: {message: '',},
  error: null
})

/* ------------- Selectors ------------- */

export const NotificationSelectors = {
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
  [Types.NOTIFICATION_REQUEST]: request,
  [Types.NOTIFICATION_SUCCESS]: success,
  [Types.NOTIFICATION_FAILURE]: failure
})
