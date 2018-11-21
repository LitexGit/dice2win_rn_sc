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
  channelRequest: ['data'],
  channelSuccess: ['payload'],
  channelFailure: null,

  getPayments: ["data"],
})

export const ChannelTypes = Types
export default Creators



/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  channel: { status: 6, channelIdentifier: 0 },

  bonus: {},
  records: [],
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
  error: null,
  payments: [],
})

/* ------------- Selectors ------------- */

export const ChannelSelectors = {
  getChannel: state => state.channel,
  getGlobalRecords: state => state.channel.global,
  getRecords: state => state.channel.records,
  // getPayments: state => state.channel.payments,
}

/* ------------- Reducers ------------- */

export const getAllBets = (state, {records}) => state.merge({records})

export const getPayments = (state, { payments }) => state.merge({ payments })


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

  console.log('==============merge======================');
  console.log(state.merge({ fetching: false, error: null, ...payload }));
  console.log('==============merge======================');
  return state.merge({ fetching: false, error: null, ...payload });
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_ALL_BETS]: getAllBets,
  [Types.SET_CHANNEL]: setChannel,
  [Types.CHANNEL_REQUEST]: request,
  [Types.CHANNEL_SUCCESS]: success,
  [Types.CHANNEL_FAILURE]: failure,
  [Types.GET_PAYMENTS]: getPayments,

})
