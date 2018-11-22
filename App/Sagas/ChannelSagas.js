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

import { call, put, select, all, take } from 'redux-saga/effects'
import ChannelActions, {ChannelSelectors} from '../Redux/ChannelRedux'
import GameActions from '../Redux/GameRedux'
import { ChannelConfirmModalSelectors } from '../Redux/ChannelConfirmModalRedux'
import { ConfigSelectors } from '../Redux/ConfigRedux'
import { WalletSelectors } from '../Redux/WalletRedux'
import { GameSelectors } from '../Redux/GameRedux'
import MessageBoxActions from '../Redux/MessageBoxRedux'
import RecordActions from '../Redux/RecordRedux'

import walletLib from '../Lib/Wallet/wallet'
import PwdModalActions, { PwdModalSelectors } from '../Redux/PwdModalRedux'

import { ConfirmModalSelectors } from '../Redux/ConfirmModalRedux';

import { channel } from 'redux-saga'

import Moment from 'moment';
import cn from 'moment/locale/zh-cn';
Moment.locale('zh-cn');

// 加载必要类库
var SCClient = require("statechannelnode");
var io = require("socket.io-client");
let SQLite = require('react-native-sqlite-storage');
let dbfactory = require('../../db/dbfactory');
let cryptoHelper = require('../../crypto/cryptoHelper');

// 获取客户端
let address = '0x56d77fcb5e4Fd52193805EbaDeF7a9D75325bdC0';
// let address = W.address;
let privateKey = '118538D2E2B08396D49AB77565F3038510B033A74C7D920C1C9C7E457276A3FB';

let socket = io("http://13.113.50.143:9527");

// let db = SQLite.openDatabase({ name: "client.db", createFromLocation: 1 }, ()=>{console.log('db open success')});

const channelListener = channel()

function * initDB(){
  console.tron.log('initDB start');
  let db = null;
  let dbInitializing = false;
  let initPromise = new Promise((resolve, reject)=>{
    dbInitializing = true;
    db = SQLite.openDatabase({ name: "client.db", createFromLocation: 1 }, () => {
      // console.log('Open Success');
      resolve(true);
    }, ()=>{
      // console.log('Open Fail');
      reject(null);
    });
  })
  yield initPromise;

  dbInitializing = false;
  let dbprovider = { type: 'react-native', config: { db: db } };
  let dbhelper = dbfactory.initDBHelper(dbprovider);

  scclient = new SCClient(web3, dbhelper, cryptoHelper, address);
  scclient.initMessageHandler(socket);
  scclient.unlockWallet(privateKey);
  global.scclient = scclient;
  global.dbInitializing = dbInitializing;

  yield listenerInit(scclient)
}

function listenerInit(client) {
  client.on('BetSettled', (channel, bet) => {
    let status = 'lose'
    let winAmount = web3.utils.fromWei(bet.winAmount, 'ether');

    if(bet.winner == 1) {
      status = 'win'
    }
    // console.log(channel)
    channelListener.put(ChannelActions.setChannel(channel));
    channelListener.put(GameActions.updateResult({[bet.modulo]: { amount: winAmount } }));
    channelListener.put(GameActions.updateStatus({ status: {[bet.modulo]: status}}));
  }).on('ChannelOpen', (channel) => {
    channelListener.put(ChannelActions.setChannel(channel));
  }).on('ChannelClose', (channel) => {
    console.log('LISTEN CHANNEL CLOSE');
    console.log(channel);
    channelListener.put(ChannelActions.setChannel(channel));
  })
}

export function * watchChannelListener() {
  while(true) {
    const action = yield take(channelListener)
    yield put(action)
  }
}

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
  if(isNaN(depositAmount) || depositAmount <= 0) {
    yield put(MessageBoxActions.openMessageBox({ title: 'Error', message: 'Amount Faild.' }));
  } else {
    depositAmount = depositAmount * 1e18;

    try {
      yield scclient.openChannel(partnerAddress, depositAmount);
      yield put(MessageBoxActions.openMessageBox({ title: 'Message', message: 'The request has been submitted. Please wait.' }));
      // 改为 Pending 状态
      yield put(ChannelActions.setChannel({
        status: 0
      }));
    } catch(err) {
      console.log(err)
      yield put(MessageBoxActions.openMessageBox({ title: 'Error', message: 'Opreation Faild.' }));
    }
  }
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

  try {
    // yield scclient.closeChannel(partnerAddress);
    yield scclient.closeChannelCooperative(partnerAddress);
    yield put(MessageBoxActions.openMessageBox({ title: 'Message', message: 'The request has been submitted. Please wait.' }));
    yield put(ChannelActions.setChannel({status: 0}));
  } catch(err) {
    yield put(MessageBoxActions.openMessageBox({ title: 'Error', message: 'Opreation Faild.' }));
  }

}

// 向通道存钱
export function * deposit (api, action) {
  // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)
  let partnerAddress = sysConfig.partnerAddress

  let depositAmount = parseFloat(yield select(ChannelConfirmModalSelectors.getChannelAmount));

  if(isNaN(depositAmount) || depositAmount <= 0) {
    yield put(MessageBoxActions.openMessageBox({ title: 'Error', message: 'Amount Faild.' }));
  } else {
    depositAmount = depositAmount * 1e18;

    try {
      yield scclient.deposit(partnerAddress, depositAmount);
      yield put(MessageBoxActions.openMessageBox({ title: 'Message', message: 'The request has been submitted. Please wait.' }));
    } catch (err) {
      yield put(MessageBoxActions.openMessageBox({ title: 'Error', message: 'Opreation Faild.' }));
    }
  }
}

// 下注
export function * startBet (api, action) {
  // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)
  let partnerAddress = sysConfig.partnerAddress

  let {betMask, modulo, value} = action.data
  let randomSeed = yield select(ConfirmModalSelectors.getGas)

  let channelObject = yield select(ChannelSelectors.getChannel)

  let channelId = channelObject.channel.channelId;
  /*
  if (!W.wallet) {
    let result = yield call(walletLib.unlockWallet, password)

    if (!result) {
      yield put(PwdModalActions.openPwdModal({
        submitedActions: [
          {
            action: ChannelActions.startBet,
            data: {betMask, modulo, value}
          }
        ]
      }))

      password = yield select(PwdModalSelectors.getPassword)
      if (!!password) {
        yield put(PwdModalActions.setErrInfo({errInfo: 'wrong password'}))
      }
      return ;
    }

    yield put(PwdModalActions.closePwdModal())
  }
  */

  // 转换成 BN
  let amount = web3.utils.toWei(value.toString(), 'ether')

  try {
    let betInfo = yield scclient.startBet(channelId, partnerAddress, betMask, modulo, amount, randomSeed);
    // console.log(betInfo);
    if(betInfo == false) {
      yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: '交易太频繁' }))
    }
  } catch(err) {
    console.log(err)
    yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: '交易太频繁' }))
  }

}

// 获取所有通道
export function * getAllChannels (api, action) {
  yield scclient.getAllChannels();
}

// 获取单个通道信息
export function * getChannel (api, action) {
  if(scclient == null && dbInitializing == false) {
    yield initDB();
  }

  // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)
  let partnerAddress = sysConfig.partnerAddress

  try {
    let channelInfo = yield scclient.getChannel(partnerAddress);

    // 初始化默认值
    if(!channelInfo) {
      channelInfo = {
        status: 6
      }
    }

    yield put(ChannelActions.setChannel(channelInfo));
  } catch (err) {
    console.log(err)
    yield put(ChannelActions.channelFailure())
  }
}

// 获取所有下注信息
export function * getAllBets (api, action) {

  const {data:param={}} = action;
  const {type='game',data={}}= param;
  const {page=1, limit=20}=data;

  const condition = '';
  let offset =  (page -1) * limit;
  offset = offset >= 0 ? offset : 0;
  let result = yield scclient.getAllBets(condition, offset, limit);

  result = result.map((item) => {
    const {createdAt} = item;
    const date = Moment(createdAt).format('YYYY-MM-DD');
    let time = Moment(createdAt).format('HH:mm:ss');
    let { timeZone } = require('../Themes/Metrics')
    time = new Date(`${date}T${time}`)
      .toLocaleTimeString('zh-CN', {timeZone, hour12: false})

    return {...item, time, date}
  })

  if(result) {
    if(page > 1) {
      let oldData = yield select(ChannelSelectors.getRecords);
      result = [...oldData, ...result];
    }
    yield put(ChannelActions.channelSuccess({[type]:result}))
  } else {
    yield put(ChannelActions.channelFailure())
  }

}


// 获取所有下注信息
export function * getPayments (api, action) {
  const {data:param={}} = action;
  const {type='payments',data={}}= param;
  const {page=1, limit=20}=data;

  const condition = '';

  let offset =  (page -1) * limit;
  offset = offset >= 0 ? offset : 0;

  let result = yield scclient.getPayments(condition, offset, limit);

  // convert date and time to local format
  result = result.map((item) => {
    const {createdAt} = item;
    const date = Moment(createdAt).format('YYYY-MM-DD');
    let time = Moment(createdAt).format('HH:mm:ss');
    let { timeZone } = require('../Themes/Metrics')
    time = new Date(`${date}T${time}`)
      .toLocaleTimeString('zh-CN', {timeZone, hour12: false})
    return {...item, time, date}
  })

  if(result) {
    if(page > 1) {
      let oldData = yield select(ChannelSelectors.getPayments);
      result = [...oldData, ...result];
    }
    yield put(ChannelActions.channelSuccess({[type]:result}))
  } else {
    yield put(ChannelActions.channelFailure())
  }
}

// 根据ID获取下注详情
export function * getBetById (api, action) {
  let {betId} = action.data

  yield scclient.getBetById(betId);
}





