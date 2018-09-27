import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  configRequest: ['data'],
  configSuccess: ['payload'],
  configFailure: null
})

export const ConfigTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: {
    telegroup:'tg://resolve/?domain=ftc_shades',
    faq: 'http://litex.io',
    shareInfo:{
      message:'ETH 4 FUN! \n shared from app',
      link: 'eth4.fun',
      title: 'share to friends and get bonus'
    }
  },
  error: null
})

/* ------------- Selectors ------------- */

export const ConfigSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

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
  [Types.CONFIG_REQUEST]: request,
  [Types.CONFIG_SUCCESS]: success,
  [Types.CONFIG_FAILURE]: failure
})
