import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  recordRequest: ['data'],
  recordSuccess: ['payload'],
  recordFailure: null
})

export const RecordTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  game:{},
  tx: {},
  bonus: {},
  global: {},
  payload:null,
  error: null
})

/* ------------- Selectors ------------- */

export const RecordSelectors = {
  getData: state => state.data,
  getRecords: state => state.record
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data})

// successful api lookup
export const success = (state, action) => {
  let { payload } = action
  return state.merge({ fetching: false, error: null, ...payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RECORD_REQUEST]: request,
  [Types.RECORD_SUCCESS]: success,
  [Types.RECORD_FAILURE]: failure
})
