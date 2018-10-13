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
import RecordActions from '../Redux/RecordRedux'
import { RecordSelectors } from '../Redux/RecordRedux'
import { GameSelectors } from '../Redux/GameRedux'
import { WalletSelectors } from '../Redux/WalletRedux'
import { UserSelectors } from '../Redux/UserRedux'

export function * getRecord (api, action) {
  const { type, data:{page,size=20} } = action.data
  console.tron.log('getRecord', page, size)
  const [ gameId, uid, address, oldData ] = yield all([
    select(GameSelectors.getGameId),
    select(UserSelectors.getUid),
    select(WalletSelectors.getAddress),
    select(RecordSelectors.getRecords)
  ])
  let response = null
  switch(type) {
    case 'bonus': response = yield call(api.getPromotionRecords, {uid, page, size});break
    case 'game': response = yield call(api.getRecord, {address, page, size});break
    case 'global': response = yield call(api.getRecord, {gameId, page, size});break
    case 'tx': response = yield call(api.getTx, {address, page, size});break
    default: response = {}
  }

  if (response.ok) {

    let { data } = response

    // convert date and time to local format
    data = data.map((item) => {
      let { date, time} = item
      let { timeZone } = require('../Themes/Metrics')
      
      time = new Date(`${date}T${time}`)
        .toLocaleTimeString('zh-CN', {timeZone, hour12: false}) 
      return {...item, time}
    })


    if(page > 1) { // load more, use append mode
      data = [...oldData, ...data]
    } else {
      type==='global' && (data = {...oldData, [gameId]: data}) 
    }

    yield put(RecordActions.recordSuccess({[type]:data}))

  } else {
    yield put(RecordActions.recordFailure())
  }
}

export function * handleGlobal(api, action) {
  let {msg} = action
  console.tron.log('getGlobalMessage', msg)
  let {modulo, id} = msg
  let global = yield select(RecordSelectors.getGlobalRecords)
  let items = global[modulo].filter(m=>m.id!=id)
  global = {...global, [modulo]:[msg, ...items]}
  yield put(RecordActions.recordSuccess({global}))
}