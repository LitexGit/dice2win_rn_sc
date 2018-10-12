import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  handleGlobal: ['msg'],
  recordRequest: ['data'],
  recordSuccess: ['payload'],
  recordFailure: null
})

export const RecordTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  refreshing: null,
  loading: null,
  game:{},
  tx: {},
  bonus: {},
  global: {
    2:[],
    6:[],
    36:[],
    100:[],
  },
  payload:null,
  error: null
})

/* ------------- Selectors ------------- */

export const RecordSelectors = {
  getData: state => state.data,
  getRecords: state => state.record[state.record.data.type],
  getGlobalRecords: state => state.record.global,
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) =>{
  let {page} = data.data
  if(page > 1){
    return state.merge({loading: true, data, payload: null})
  } else {
    return state.merge({refreshing: true, data, payload: null})
  }
}

// successful api lookup
export const success = (state, action) => {
  let { payload } = action
  return state.merge({ refreshing: false, loading: false, error: null, ...payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ refreshing: false, loading: false, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RECORD_REQUEST]: request,
  [Types.RECORD_SUCCESS]: success,
  [Types.RECORD_FAILURE]: failure
})
