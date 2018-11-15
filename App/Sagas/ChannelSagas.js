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

import { call, put, select, all } from 'redux-saga/effects'
import ChannelActions from '../Redux/ChannelRedux'
import { ChannelSelectors } from '../Redux/ChannelRedux'
import { ChannelConfirmModalSelectors } from '../Redux/ChannelConfirmModalRedux'
import { ConfigSelectors } from '../Redux/ConfigRedux'
import MessageBoxActions from '../Redux/MessageBoxRedux'

// 加载必要类库
var SCClient = require("statechannelnode");
var io = require("socket.io-client");
let SQLite = require('react-native-sqlite-storage');
let dbfactory = require('../../db/dbfactory');

// 获取客户端
let address = '0x56d77fcb5e4Fd52193805EbaDeF7a9D75325bdC0';
let privateKey = '118538D2E2B08396D49AB77565F3038510B033A74C7D920C1C9C7E457276A3FB';

let socket = io("http://192.168.51.227");
let db = SQLite.openDatabase({ name: "client.db", createFromLocation: 1 });
let dbprovider = { type: 'react-native', config: { db: db } };
let dbhelper = dbfactory.initDBHelper(dbprovider);

scclient = new SCClient(web3, dbhelper, address, privateKey);
scclient.initMessageHandler(socket);
console.tron.log('scclient', scclient);

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

  // let depositAmount = yield select(ChannelConfirmModalSelectors.getChannelAmount)
  let depositAmount = 0.1 * 1e18;

  // yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: 'a: '+depositAmount }))
  // return;
  let channel = yield scclient.openChannel(partnerAddress, depositAmount);
  console.tron.log(channel)
  yield put(ChannelActions.setChannel(channel));
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

  yield scclient.closeChannel(partnerAddress);
}

// 向通道存钱
export function * deposit (api, action) {
  // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)

  let partnerAddress = sysConfig.partnerAddress
  let depositAmount = yield select(ChannelConfirmModalSelectors.getChannelAmount);

  yield scclient.deposit(partnerAddress, depositAmount);
}

// 下注
export function * startBet (api, action) {
  // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)

  let partnerAddress = sysConfig.partnerAddress
  let {betMask, modulo, value, randomSeed} = action.data

  yield scclient.startBet(partnerAddress, betMask, modulo, value, randomSeed);
}

// 获取所有通道
export function * getAllChannels (api, action) {
  yield scclient.getAllChannels();
}

// 获取单个通道信息
export function * getChannel (api, action) {
  // 读取Channel信息
  let channel = yield select(ChannelSelectors.getChannel);
  // let channelIdentifier = channel.channelId;
  let channelIdentifier = '0x2afe9725b95038ec3fc02ca77d4d39ae229f17d94904c5da1d18d0eaab75c614';
  
  if(!channelIdentifier) 
    return ;
  
  try {
    yield scclient.dbhelper.getChannel(channelIdentifier).then((channel) => {
      if(!channel)
        return;
      console.tron.log('channel is ', channel);
      ChannelActions.setChannel(channel);
    });

  } catch (err) {
    yield put(ChannelActions.channelFailure())
  }
}

// 获取所有下注信息
export function * getAllBets (api, action) {
  let {condition, offset, limit} = action.data

  yield scclient.getAllBets(condition, offset, limit);
}

// 根据ID获取下注详情
export function * getBetById (api, action) {
  let {betId} = action.data

  yield scclient.getBetById(betId);
}
