/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put } from 'redux-saga/effects'
import ChannelActions from '../Redux/ChannelRedux'
// import { ChannelSelectors } from '../Redux/ChannelRedux'
import { ChannelConfirmModalSelectors } from '../Redux/ChannelConfirmModalRedux'
import { ConfigSelectors } from '../Redux/ConfigRedux'

/*
export function * getChannel (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(ChannelSelectors.getData)
  // make the call to the api
  const response = yield call(api.getchannel, data)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(ChannelActions.channelSuccess(response.data))
  } else {
    yield put(ChannelActions.channelFailure())
  }
}
*/

// 加载必要类库
var SCClient = require("statechannelnode");
var io = require("socket.io-client");
let SQLite = require('react-native-sqlite-storage');
var squel = require("squel");
let dbfactory = require('../../db/dbfactory');

let ethWSUrl = 'ws://54.250.21.165:8546';
let address = '0x56d77fcb5e4Fd52193805EbaDeF7a9D75325bdC0';
let privateKey = '118538D2E2B08396D49AB77565F3038510B033A74C7D920C1C9C7E457276A3FB';

let socket = io("http://192.168.51.227");
let dbprovider = { type: 'react-native', config: { db: this.db } };
let dbhelper = dbfactory.initDBHelper(dbprovider);

// 获取客户端
let scclient = new SCClient(web3, dbhelper, address, privateKey);
scclient.initMessageHandler(socket);

/**
 * 开通通道
 * 
 * @description 参数说明
 * [
 *   string partnerAddress 对方以太坊地址
 *   string / BN depositAmount 存入金额
 * ]
 */
export function * openChannel (api, action) {
  // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)

  let partnerAddress = sysConfig.partnerAddress
  let depositAmount = yield select(ChannelConfirmModalSelectors.getChannelAmount);

  yield call(scclient.openChannel(partnerAddress, depositAmount));
}

/**
 * 关闭通道
 * 
 * @description 参数说明
 * [
 *   string partnerAddress 对方以太坊地址
 * ] 
 */
export function * closeChannel (api, action) {
  // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)

  let partnerAddress = sysConfig.partnerAddress

  yield call(scclient.closeChannel(partnerAddress));
}

// 向通道存钱
export function * deposit (api, action) {
  // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)

  let partnerAddress = sysConfig.partnerAddress
  let depositAmount = yield select(ChannelConfirmModalSelectors.getChannelAmount);

  yield call(scclient.deposit(partnerAddress, depositAmount));
}

// 下注
export function * startBet (api, action) {
  // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)

  let partnerAddress = sysConfig.partnerAddress
  let {betMask, modulo, value, randomSeed} = action.data

  yield call(scclient.startBet(partnerAddress, betMask, modulo, value, randomSeed));
}

// 获取所有通道
export function * getAllChannels (api, action) {
  yield call(scclient.getAllChannels());
}

// 获取单个通道信息
export function * getChannel (api, action) {
  // 读取配置信息
  // let sysConfig = yield select(ConfigSelectors.getConfig)
  // let partnerAddress = sysConfig.partnerAddress
  // console.log(scclient)
  // scclient.dbhelper.getChannel(channelIdentifier).then((channel)=>{
  //   if(!channel)
  //     return;
  //   console.tron.log('channel is ', channel);
  //   // let str = "local: " + channel.localBalance + "    remote: " + channel.remoteBalance + " status: " + channel.status;
  //   ChannelActions.setChannel(channel);
  // });

  
  try {
    // yield call(scclient.getChannel(partnerAddress));
    yield put(ChannelActions.channelSuccess({
      channel_identifier: '123', 
      partner_address: 'partner_address', 
      total_amount: '100.00', 
      local_balance: '40', 
      remote_balance: '45', 
      local_lock_amount: '10', 
      remote_lock_amount: '5', 
      state: 'opened', 
      settle_timeout: 500, 
      reveal_timeout: 30}))

  } catch (err) {
    yield put(ChannelActions.channelFailure())
  }
  
}

// 获取所有下注信息
export function * getAllBets (api, action) {
  let {condition, offset, limit} = action.data

  yield call(scclient.getAllBets(condition, offset, limit));
}

// 根据ID获取下注详情
export function * getBetById (api, action) {
  let {betId} = action.data

  yield call(scclient.getBetById(betId));
}
