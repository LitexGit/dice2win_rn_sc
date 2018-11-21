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

import { ConfirmModalSelectors } from '../Redux/ConfirmModalRedux';

import { channel } from 'redux-saga'

// 加载必要类库
var SCClient = require("statechannelnode");
var io = require("socket.io-client");
let SQLite = require('react-native-sqlite-storage');
let dbfactory = require('../../db/dbfactory');

// 获取客户端
let address = '0x56d77fcb5e4Fd52193805EbaDeF7a9D75325bdC0';
// let address = W.address;
let privateKey = '118538D2E2B08396D49AB77565F3038510B033A74C7D920C1C9C7E457276A3FB';

let socket = io("http://192.168.51.227");

// let db = SQLite.openDatabase({ name: "client.db", createFromLocation: 1 }, ()=>{console.log('db open success')});

const channelListener = channel()

function * initDB(){
  console.tron.log('initDB start');
  let db = null;
  let dbInitializing = false;
  let initPromise = new Promise((resolve, reject)=>{
    dbInitializing = true;
    db = SQLite.openDatabase({ name: "client.db", createFromLocation: 1 }, ()=>{
      console.log('Open Success');
      resolve(true);
    }, ()=>{
      console.log('Open Fail');
      reject(null);
    });
  })
  yield initPromise;

  dbInitializing = false;
  let dbprovider = { type: 'react-native', config: { db: db } };
  let dbhelper = dbfactory.initDBHelper(dbprovider);

  scclient = new SCClient(web3, dbhelper, address, privateKey);
  scclient.initMessageHandler(socket);
  global.scclient = scclient;
  global.dbInitializing = dbInitializing;

  yield listenerInit(scclient)
}

function listenerInit(client) {
  client.on('BetSettled', (channel, bet)=>{
    let result = 'lose'
    if(bet.winner == 1) {
      result = 'win'
    }
    // console.log(channel)
    channelListener.put(ChannelActions.setChannel(channel));
    channelListener.put(GameActions.updateStatus({status:{[bet.modulo]: result}}))
  }).on('ChannelOpen', (channel)=> {
    this.channelIdentifier = channel.channelId;

  }).on('CooperativeSettled', (channel)=>{

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
    console.log(depositAmount)
    depositAmount = depositAmount * 1e18;

    try {
      yield scclient.openChannel(partnerAddress, depositAmount);
      yield put(MessageBoxActions.openMessageBox({ title: 'Message', message: 'The request has been submitted. Please wait.' }));

      // 监听通道开启事件
    scclient.on('ChannelOpen', (channel) => {
      put(ChannelActions.setChannel({ channel }));
    })

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

  // 转换成 BN
  let amount = web3.utils.toWei(value.toString(), 'ether')

  try {
    let betInfo = yield scclient.startBet('0x08b2f4a26bb6d160013ea88404467d864c041a8a52d74e468a046d1cebc1dafe', partnerAddress, betMask, modulo, amount, randomSeed);
    if(betInfo == false) {
      yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: '交易请求次数过多' }))
    }
  } catch(err) {
    console.log(err)
    yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: '交易请求次数过多' }))
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
  const [ gameId, address, record] = yield all([
    select(GameSelectors.getGameId),
    select(WalletSelectors.getAddress),
    select(ChannelSelectors.getRecords)
  ])

  let condition = '1 = 1';
  // switch(type) {
  //   case 'game': data = yield scclient.getAllBets(condition, page, size); break
  //   case 'records': data = yield scclient.getAllBets(condition, page, size); break
  //   default: data = {}
  // }

  let page = 1;
  let type = 'game'

  let data = yield scclient.getAllBets(condition, 1, 20);

  // if(data) {
  //   if(page > 1) { // load more, use append mode
  //     data = [...oldData, ...data]
  //   }
  //   yield put(ChannelActions.channelSuccess({[type]:data}))
  // } else {
  //   yield put(ChannelActions.channelFailure())
  // }

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
    item.date = "2018-11-15";
    item.time = "05:55:21";
    let { date, time} = item
    let { timeZone } = require('../Themes/Metrics')

    time = new Date(`${date}T${time}`)
      .toLocaleTimeString('zh-CN', {timeZone, hour12: false})
    return {...item, time, date}
  })
  console.log('===========result=========================');
  console.log(result);
  console.log('===========result=========================');


  if(result) {
    if(page > 1) {
      result = [...oldData, ...result]
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





