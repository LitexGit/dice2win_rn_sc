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

export function * getGameRecords (api, action) {
  const { data: {gameId, page, size} } = action
  const response = yield call(api.getRecord, {gameId, page, size})
  if (response.ok) {
    yield put(RecordActions.recordSuccess({global: response.data}))
  } else {
    yield put(RecordActions.recordFailure())
  }
}

export function * getRecord (api, action) {
  console.tron.log('getRecord', action.data)
  const { type, data:{page,size} } = action.data
  const [ gameId, uid, address ] = yield all([
    select(GameSelectors.getGameId),
    select(UserSelectors.getUid),
    select(WalletSelectors.getAddress),
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
    if(page) { // load more, use append mode
      let data = yield select(RecordSelectors)[type]
      yield put(RecordActions.recordSuccess({[type]:[...data, ...response.data]}))
    } else {
      yield put(RecordActions.recordSuccess({[type]:response.data}))
    }
  } else {
    yield put(RecordActions.recordFailure())
  }
}
