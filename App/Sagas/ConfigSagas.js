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
import GameActions from '../Redux/GameRedux'
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
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(ConfigActions.configSuccess(response.data))
  } else {
    yield put(ConfigActions.configFailure())
  }
}

const socketStatusChannel = channel()

export function * socketInit(api, action) {
  if(!socket) {
    let {address} = action
    console.tron.log('socket address', address)
    yield socket = SocketIOClient(address)
    socket.on('connect', socketConnected)
      .on('settle', socketMessage)
      .on('history', socketMessage)
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

const socketConnected = () => {
  socketStatusChannel.put(ConfigActions.socketStatus('on'))
  console.tron.log('Socket Connected')
}

const socketMessage = (msg) => {
  let status = msg.bet_res
  socketStatusChannel.put(GameActions.updateStatus(status))
  if(status === 'win'){
    let result = {amount: msg.dice_payment}
    socketStatusChannel.put(GameActions.updateResult(result))
  }
  console.tron.log('Socket MSG:', msg)
}

function * socketError (err) {
  console.tron.log('Socket ERROR:', err.message)
}

function * socketClosed (e) {
  socketStatusChannel.put(ConfigActions.socketStatus('off'))
  console.tron.log('Socket CLOSE', e)
}