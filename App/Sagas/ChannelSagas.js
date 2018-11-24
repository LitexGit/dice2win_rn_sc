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
// import { GameSelectors } from '../Redux/GameRedux'
import MessageBoxActions from '../Redux/MessageBoxRedux'
// import RecordActions from '../Redux/RecordRedux'

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

let socket = io("http://13.113.50.143:9527");


import Toast from 'react-native-root-toast'

// socket.on('connect', ()=>{
//   Toast.show('L2SOCKET connect ');

// }).on('connect_error', ()=>{
//   Toast.show('L2SOCKET connect_erro');
// }).on('connect_timeout', (timeout)=>{
//   Toast.show('L2SOCKET connect_timeout');
// }).on('disconnect', (reason)=>{
//   Toast.show('L2SOCKET disconnect');
// }).on('reconnect', ()=>{
//   Toast.show('L2SOCKET reconnect');
// })


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

  scclient = new SCClient(web3, dbhelper, cryptoHelper, W.address);

  scclient.initMessageHandler(socket);

  // 新建钱包时 逻辑处理。
  if(!scclient.walletUnlocked && !!W.wallet) {
    scclient.unlockWallet( (W.wallet.privateKey).substr(2) );
  }

  global.scclient = scclient;
  global.dbInitializing = dbInitializing;

  yield listenerInit(scclient)
      // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)
  let partnerAddress = sysConfig.partnerAddress
  yield scclient.sync(partnerAddress)
}

/**
 * 监听事件
 * @param {SCClient} client  状态通道客户端
 */
function listenerInit(client) {
  client.on('BetSettled', (channel, bet) => {
    let status = 'lose'
    // console.log(bet)
    let winAmount = web3.utils.fromWei(web3.utils.toBN(bet.winAmount).add(web3.utils.toBN(bet.value)).toString(10), 'ether');

    if(bet.winner == 1) {
      status = 'win'
    }
    // console.log(channel)
    channelListener.put(ChannelActions.setChannel(channel));
    channelListener.put(GameActions.updateResult({[bet.modulo]: { amount: winAmount, betDetail: bet} }));
    channelListener.put(GameActions.updateStatus({ status: {[bet.modulo]: status}}));
  }).on('ChannelOpen', (channel) => {
    channelListener.put(ChannelActions.setChannel(channel));
  }).on('ChannelClosed', (channel) => {
    console.log('LISTEN CHANNEL CLOSE');
    console.log(channel);
    channelListener.put(ChannelActions.setChannel(channel));
  }).on('BalanceProofUpdated', (channel) => {
    console.log('LISTEN Balance Proof Updated');
    console.log(channel);
    channelListener.put(ChannelActions.setChannel(channel));
  }).on('CooperativeSettled', function(channel){
    console.log('LISTEN Cooperative Settled');
    console.log(channel);
    channelListener.put(ChannelActions.setChannel(channel));
  }).on('ChannelDeposit', function(channel){
    console.log('LISTEN Channel Deposit');
    console.log(channel);
    channelListener.put(ChannelActions.setChannel(channel));
  });

}

// 循环监听通道事件
export function * watchChannelListener() {
  while(true) {
    const action = yield take(channelListener)
    yield put(action)
  }
}

function * unlockWallet(redirectAction, redirectData) {
  let password = yield select(PwdModalSelectors.getPassword)
  if (!W.wallet) {
    let result = yield call(walletLib.unlockWallet, password)

    // 解锁失败
    if (!result) {
      yield put(PwdModalActions.openPwdModal({
        submitedActions: [
          {
            action: redirectAction,
            data: redirectData
          }
        ]
      }))

      if (!!password) {
        yield put(PwdModalActions.setErrInfo({errInfo: 'wrong password'}))
      }
      return ;
    }

    // 解锁库
    if(!scclient.walletUnlocked) {
      scclient.unlockWallet( (W.wallet.privateKey).substr(2) );
    }

    yield put(PwdModalActions.closePwdModal())
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
  if(!scclient.walletUnlocked || !W.wallet) {
    yield unlockWallet(ChannelActions.openChannel);
    return ;
  } else {
    let wallet = yield select(WalletSelectors.getWallet);
    let depositAmount = yield select(ChannelConfirmModalSelectors.getChannelAmount);
    // console.log(W.wallet)
    if(isNaN(depositAmount) || depositAmount <= 0) {
      yield put(MessageBoxActions.openMessageBox({ title: 'Error', message: 'Amount Faild.' }));
      return ;
    } else if(wallet.balance < depositAmount) {
      yield put(MessageBoxActions.openMessageBox({ title: 'Error', message: 'Not sufficient funds.' }));
      return ;
    } else {
      // 读取配置信息
      let sysConfig = yield select(ConfigSelectors.getConfig)
      let partnerAddress = sysConfig.partnerAddress

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
  if(!scclient.walletUnlocked || !W.wallet) {
    yield unlockWallet(ChannelActions.closeChannel);
  }

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
  if(!scclient.walletUnlocked || !W.wallet) {
    yield unlockWallet(ChannelActions.deposit);
  }

  // 读取配置信息
  let sysConfig = yield select(ConfigSelectors.getConfig)
  let partnerAddress = sysConfig.partnerAddress

  let depositAmount = parseFloat(yield select(ChannelConfirmModalSelectors.getChannelAmount));
  let wallet = yield select(WalletSelectors.getWallet);

  if(isNaN(depositAmount) || depositAmount <= 0) {
    yield put(MessageBoxActions.openMessageBox({ title: 'Error', message: 'Amount Faild.' }));
  } else if (wallet.balance < depositAmount) {
    yield put(MessageBoxActions.openMessageBox({ title: 'Error', message: 'Not sufficient funds.' }));
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

  if(!scclient.walletUnlocked || !W.wallet) {
    yield unlockWallet(ChannelActions.startBet, {betMask, modulo, value});
  }

  // 转换成 BN
  let amount = web3.utils.toWei(value.toString(), 'ether')

  try {
    let betInfo = yield scclient.startBet(channelId, partnerAddress, betMask, modulo, amount, randomSeed);
    // console.log(betInfo);
    if(betInfo == false) {
      yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: '交易太频繁' }))
    } else {

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

/**
 * 与本地同步链上通道状态
 * @param api
 * @param action
 */
export function* syncChannel(api, action) {

  try{
    let result = yield web3.eth.net.isListening();
    console.log('web3 listening is ok', result);
  }catch(err){
    const Web3 = require('web3');
    let ethWSUrl = 'ws://54.250.21.165:8546';
    let web3 = new Web3(Web3.givenProvider || ethWSUrl);
    global.web3 = web3;

    if (global.scclient != null) {
      console.log('init web3 here');
      global.scclient.initWeb3(web3);
    }
  }

  let sysConfig = yield select(ConfigSelectors.getConfig)
  let partnerAddress = sysConfig.partnerAddress
  yield scclient.sync(partnerAddress)

  try {
    let channelInfo = yield scclient.getChannel(partnerAddress);

    // 初始化默认值
    if (!channelInfo) {
      channelInfo = {
        status: 6
      }
    }

    yield put(ChannelActions.setChannel(channelInfo));
  } catch (err) {
    // console.log(err)
    yield put(ChannelActions.channelFailure())
  }
}

// 获取单个通道信息
export function * getChannel (api, action) {
  // console.log(W.wallet);
  if(scclient == null && dbInitializing == false) {
    yield initDB();
  }

  let channelObject = yield select(ChannelSelectors.getChannel)
  // if(channelObject.channel.status !== 0) {
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
      // console.log(err)
      yield put(ChannelActions.channelFailure())
    }
  // }
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

    return {...item, time, date, isOpen:false}
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





