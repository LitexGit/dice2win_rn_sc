import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  register: ['data'],
  userRequest: ['data'],
  userSuccess: ['payload'],
  userFailure: null,
  // 设置 邀请码
  setInviteCode: ['invite'],
  fetchInviteCode: null
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,

  uid: 0,
  nickname: '',
  address: '',
  inviter: 0,
  code: '',
  invite: '',

  bonus: 0,
  totalBonus: 0,

  error: null
})

/* ------------- Selectors ------------- */

export const UserSelectors = {
  getData: state => state.data,
  getUid: state => state.user.uid,
  getInviteCode: state => state.user.invite,
  getBonus: state => state.user.bonus,
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, ...payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

// 保存 邀请人的邀请码
export const setInviteCode = (state, action) => {
  const {invite} = action
  return state.merge({invite})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.REGISTER]: request,
  [Types.USER_REQUEST]: request,
  [Types.USER_SUCCESS]: success,
  [Types.USER_FAILURE]: failure,
  [Types.SET_INVITE_CODE]: setInviteCode
})
