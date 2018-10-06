import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getGameRecords: ['data'],
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
  game:{sections:[]},
  tx: {sections:[]},
  bonus: {sections:[]},
  global: {items:[]},
  payload:{
    game: {sections:[]},
    tx: {sections:[]},
    bonus: {sections:[]},
    global: {items:[]},
  },
  error: null
})

/* ------------- Selectors ------------- */

export const RecordSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data, payload:state.payload })

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
