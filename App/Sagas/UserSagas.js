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

import { call, put, select } from 'redux-saga/effects'
import UserActions from '../Redux/UserRedux'
import { UserSelectors } from '../Redux/UserRedux'

import { Clipboard } from 'react-native'

export function * register (api, action) {
  const {data} = action

  let invite = yield select(UserSelectors.getInviteCode)
  console.tron.log('invite', invite)
  if (!!invite) {
    data.inviter = invite
    console.tron.log('invite data', data)
  }

  const response = yield call(api.register, data)
  if (response.ok) {
    // let {
    //     id: uid, nickname, eth_address:address, inviter, aff_code:code, balance:bonus
    // } = response.data
    // let userInfo = {uid, nickname, address, inviter, code, bonus}
    // yield put(UserActions.userSuccess(userInfo))
    let {id: uid} = response.data
    yield put(UserActions.userRequest(uid))

  } else {
    yield put(UserActions.userFailure())
  }
}

export function * getUser (api, action) {
  const {data: uid} = action
  const userRes = yield call(api.getUser, uid)

  if (userRes.ok) {
    let {nickname, eth_address: address, inviter, aff_code: code, balance: bonus, share_url, share_info: {total_earning: totalBonus}} = userRes.data
    let userInfo = {uid, nickname, address, inviter, code, bonus, totalBonus, share_url}
    yield put(UserActions.userSuccess(userInfo))
  } else {
    yield put(UserActions.userFailure())
  }
}

export function * fetchInviteCode (api, action) {
  let inviteCode = yield Clipboard.getString()
  console.tron.log('invite', inviteCode)

  if (!!inviteCode && inviteCode.substr(0, 8) == 'Dice2Win') {
    yield put(UserActions.setInviteCode(inviteCode.substr(8)))
    console.tron.log('invite aa', inviteCode.substr(8))
    // TODO: clear clipboard
    yield Clipboard.setString('')

  }
}
