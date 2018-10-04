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
        id, nickname, eth_address, inviter, aff_code, balance
    } = response.data

    let userInfo = {
        uid:id, inviter, nickname, address: eth_address, code: aff_code, bonus: balance
    }

    yield put(UserActions.userSuccess(userInfo))

  } else {
    yield put(UserActions.userFailure())
  }
}

export function * getUser (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(UserSelectors.getData)
  // make the call to the api
  const response = yield call(api.getUser, data)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(UserActions.userSuccess(response.data))
  } else {
    yield put(UserActions.userFailure())
  }
}
