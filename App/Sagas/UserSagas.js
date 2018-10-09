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
import UserActions from '../Redux/UserRedux'
// import { UserSelectors } from '../Redux/UserRedux'

export function * register (api, action) {
  const { data } = action
  const response = yield call(api.register, data)
  if(response.ok){
    let {
        id: uid, nickname, eth_address:address, inviter, aff_code:code, balance:bonus
    } = response.data
    let userInfo = {uid, nickname, address, inviter, code, bonus}
    // yield put(UserActions.userSuccess(userInfo))
    yield put(UserActions.userRequest(uid))

  } else {
    yield put(UserActions.userFailure())
  }
}

export function * getUser (api, action) {
  const { data:uid } = action
  const userRes = yield call(api.getUser, uid)
  const promotionRes = yield call(api.getPromotion, uid)

  let userInfo = {}
  if (userRes.ok) {
    let {nickname, eth_address:address, inviter, aff_code:code, balance:bonus } = userRes.data
    userInfo = {...userInfo, nickname, address, inviter, code, bonus}
  }
  if(promotionRes.ok) {
    let {total_aff_amount:totalBonus } = promotionRes.data
    userInfo = {...userInfo, nickname, address, inviter, code, bonus, totalBonus}
  }

  if(Object.keys(userInfo).length){
    yield put(UserActions.userSuccess(userInfo))
  } else {
    yield put(UserActions.userFailure())
  }
}
