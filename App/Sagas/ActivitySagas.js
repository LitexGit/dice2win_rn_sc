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

import { call, put, all } from 'redux-saga/effects'
import ActivityActions from '../Redux/ActivityRedux'

export function * getActivity (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(ActivitySelectors.getData)
  // make the call to the api
  let [bannerRes, noticeRes] = yield all([
    call(api.getBanners, data),
    call(api.getNotices, data),
  ]) 

  // success?
  if (bannerRes.ok || noticeRes.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(ActivityActions.activitySuccess({banners: bannerRes.data, notices: noticeRes.data}))
  } else {
    yield put(ActivityActions.activityFailure())
  }
}
