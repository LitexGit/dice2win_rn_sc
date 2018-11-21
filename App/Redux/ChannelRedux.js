import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openChannel: ["data"],
  closeChannel: ["data"],
  deposit: ["data"],
  startBet: ["data"],
  getAllChannels: ["data"],
  getChannelInfo: ["data"],
  getAllBets: ["data"],
  getBetById: ["data"],

  setChannel: ["channel"],
  setTimer: ["timer"],

  channelRequest: ['data'],
  channelSuccess: ['payload'],
  channelFailure: null
})

export const ChannelTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  channel: { status: 6, channelIdentifier: 0 },

  bonus: {},
  record: {},
  global: {
    2:[],
    6:[],
    36:[],
    100:[],
  },

  timer: null,

  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const ChannelSelectors = {
  getChannel: state => state.channel,
  getRecords: state => state.channel.record,
  getGlobalRecords: state => state.channel.global,
  getTimer: state => state.channel.timer
}

/* ------------- Reducers ------------- */

export const setChannel = (state, {channel}) =>
  state.merge({ channel })

export const setTimer = (state, { timer }) =>
  state.merge({ timer })

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
  [Types.SET_CHANNEL]: setChannel,
  [Types.SET_TIMER]: setTimer,

  [Types.CHANNEL_REQUEST]: request,
  [Types.CHANNEL_SUCCESS]: success,
  [Types.CHANNEL_FAILURE]: failure
})
