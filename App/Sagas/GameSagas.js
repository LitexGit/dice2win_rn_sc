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
import GameActions from '../Redux/GameRedux'
import { ConfigSelectors } from '../Redux/ConfigRedux'
import BetActions, { BetSelectors } from '../Redux/BetRedux'
import { getMaxBet } from '../Lib/Utils/calculate'
import { toFixed } from '../Lib/Utils/format'

export function * setStake (api, action) {
  let {stake} = action
  !stake && (stake = 0)
  let [maxWin, minBet, edge, winRate] = yield all([
    select(ConfigSelectors.getMaxWin),
    select(ConfigSelectors.getMinBet),
    select(ConfigSelectors.getEdge), 
    select(BetSelectors.getWinRate),
  ])
  let maxBet = parseFloat(toFixed(getMaxBet(maxWin, winRate, edge), 2))
  stake > maxBet && (stake = maxBet)
  stake < minBet && (stake = minBet)
  stake = parseFloat(stake.toFixed(2))
  let feeRate = 0.01
  stake <= 0.02 && (feeRate = 0.015)
  stake <= 0.01 && (feeRate = 0.03)
  yield put(GameActions.gameSuccess({stake, rand: Math.random()}))
  yield put(BetActions.betSuccess({feeRate}))
  yield put(BetActions.updateRewardTime({winRate, feeRate}))
}

export function * getGame (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(GameSelectors.getData)
  // make the call to the api
  const response = yield call(api.getgame, data)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(GameActions.gameSuccess(response.data))
  } else {
    yield put(GameActions.gameFailure())
  }
}