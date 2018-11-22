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
  checkGameDetail: ["data"],

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
  loading: false,
  refreshing: false,
  checkType:'selected',
})

/* ------------- Selectors ------------- */

export const ChannelSelectors = {
  getChannel: state => state.channel,
  getGlobalRecords: state => state.channel.global,
  getPayments: state => state.channel.payments,

  getRecords: state => state.channel.records, // game ??
}

/* ------------- Reducers ------------- */
export const getAllBets = (state, {records}) => state.merge({records})
export const getPayments = (state, { payments }) => state.merge({ payments })

export const checkGameDetail = (state, {data}) => {
  const betId = data.item.item.betId;
  const checkType = data.item.checkType;
  let gameArray = state.game;
  if (checkType == 'selected') { // 点击查看详情
    gameArray = gameArray.map((item) => {
      let isOpen = true;
      if (item.betId === betId) {
        isOpen = !item.isOpen;
      } else {
        isOpen = false;
      }
      return {...item, isOpen}
    })
  } else { // 开始滚动
    gameArray = gameArray.map((item) => {
      return {...item, isOpen:false}
    })
  }
  return state.merge({game:gameArray})
}



export const setChannel = (state, {channel}) =>
  state.merge({ channel })

export const setTimer = (state, { timer }) =>
  state.merge({ timer })

// request the data from an api
export const request = (state, {data} ) =>{

  let {page=1} = data
  if(page > 1){
    return state.merge({loading: true, data, payload: null})
  } else {
    return state.merge({refreshing: true, data, payload: null})
  }
}

// successful api lookup
export const success = (state, { payload }) => {
  console.log('============success========================');
  console.log(payload);
  console.log('============success========================');
  return state.merge({ refreshing: false, loading: false, error: null, ...payload })
}

// Something went wrong somewhere.
export const failure = state => state.merge({ refreshing: false, loading: false, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CHANNEL]: setChannel,
  [Types.CHANNEL_REQUEST]: request,
  [Types.CHANNEL_SUCCESS]: success,
  [Types.CHANNEL_FAILURE]: failure,

  [Types.GET_PAYMENTS]: request,
  [Types.GET_ALL_BETS]: request,
  [Types.CHECK_GAME_DETAIL]: checkGameDetail,
})
