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

import { channel } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'
import ConfigActions from '../Redux/ConfigRedux'
import RecordActions, {RecordSelectors} from '../Redux/RecordRedux'
import GameActions from '../Redux/GameRedux'
import NotificationActions from '../Redux/NotificationRedux'
import WalletActions from '../Redux/WalletRedux'
import SocketIOClient from 'socket.io-client'
// import { ConfigSelectors } from '../Redux/ConfigRedux'

export function * getConfig (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(ConfigSelectors.getData)
  // make the call to the api
  const response = yield call(api.getConfig, data)

  // success?
  if (response.ok) {
    console.tron.log('getConfig', response.data)
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(ConfigActions.configSuccess(response.data))


    let { network, base_domain, ws } = response.data

    console.tron.log('network', network, base_domain, ws)
    if (!!network) W.network = network
    if (!!base_domain) ApiSauceObj.setBaseURL(base_domain)

    console.tron.log(`omg i am now at ${ApiSauceObj.getBaseURL()}`)
  // console.tron.log('omg api is', api)

    /* AFTER API Setup */
    yield put(ConfigActions.socketInit(ws))
    yield put(NotificationActions.initNotification())


  } else {
    // if get config fail, will init wallet only
    yield put(ConfigActions.configFailure())
  }
}

const socketStatusChannel = channel()

export function * socketInit(api, action) {
  console.tron.log('socket init', socket)
  if(!socket) {
    let {address} = action
    console.tron.log('socket address', address)
    yield socket = SocketIOClient(address, { forceNew: true })
    socket.on('connect', socketConnected)
      .on('reconnect', socketReconnect)
      .on('settle', socketMessage)
      .on('history', socketHistoryMessage)
      .on('report', socketReportMessage)
      .on('error', socketError)
      .on('disconnect', socketClosed)
  }
}

export function * watchSocketStatusChannel(){
  console.tron.log('Watching Socket Status')
  while(true){
    const action = yield take(socketStatusChannel)
    yield put(action)
  }
}

function  socketConnected() {
  socketStatusChannel.put(ConfigActions.socketStatus('on'))
  console.tron.log('Socket Connected', socket.id)

  if(!!W.address){
    socket.emit('lottery', W.address)
  }
}

const socketMessage = (msg) => {
  let status = msg.bet_res
  !!status && socketStatusChannel.put(GameActions.updateStatus({[msg.modulo]:status}))
  if(status === 'win'){
    let result = {[msg.modulo]:{amount: msg.dice_payment}}
    socketStatusChannel.put(GameActions.updateResult(result))
  }
  socket.emit('ack', msg._msgId)
  console.tron.log('Socket MSG:', msg)
}


const socketReportMessage = (msg) => {
  console.tron.log('Socket Report MSG: ', msg);

  if(!!msg && msg == 'address'){
    if (!!W.address) {
      socket.emit('lottery', W.address)
    }
  }

}

const socketHistoryMessage = (msg) => {
  console.tron.log('Socket History MSG:', msg)
  if(!!msg){
    socketStatusChannel.put(RecordActions.handleGlobal(msg))
  }
}

function socketError (err) {
  console.tron.log('Socket ERROR:', err.message)
}

function socketClosed (e) {
  socketStatusChannel.put(ConfigActions.socketStatus('off'))
  console.tron.log('Socket CLOSE', e)
}

function socketReconnect(e) {
  socketStatusChannel.put(ConfigActions.socketStatus('on'))
  console.tron.log('Socket Reconnect', e)

  if(!!W.address){
    socket.emit('lottery', W.address)
  }
}
