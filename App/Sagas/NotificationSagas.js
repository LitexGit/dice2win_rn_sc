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
import NotificationActions from '../Redux/NotificationRedux'
import BetActions from '../Redux/BetRedux'
import GameActions from '../Redux/GameRedux'
// import { NotificationSelectors } from '../Redux/NotificationRedux'

import JPushModule from 'jpush-react-native'
import { Platform } from 'react-native'
import mergeProps from 'react-redux/es/connect/mergeProps';
import NavigationActions from 'react-navigation/src/NavigationActions';

const notificationStatusChannel = channel()

export function * watchNotificationStatusChannel(){
  console.tron.log('Watching Notification Status')
  while(true){
    const action = yield take(notificationStatusChannel)
    console.tron.log('notification channel process', action)
    yield put(action)
  }
}

export function * getNotification (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(NotificationSelectors.getData)
  // make the call to the api
  const response = yield call(api.getnotification, data)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(NotificationActions.notificationSuccess(response.data))
  } else {
    yield put(NotificationActions.notificationFailure())
  }
}


export function * initNotification(api, action){

    if (Platform.OS === 'android') {
      JPushModule.initPush()
      // JPushModule.getInfo(map => {
        // this.setState({
        //   appkey: map.myAppKey,
        //   imei: map.myImei,
        //   package: map.myPackageName,
        //   deviceId: map.myDeviceId,
        //   version: map.myVersion
        // })
      // })
      JPushModule.notifyJSDidLoad(resultCode => {
        if (resultCode === 0) {
          console.tron.log('notifyJSDidLoad: ', resultCode)
          JPushModule.addReceiveCustomMsgListener((message) => {
            console.tron.log('JPushMessageReceived: ', message)
            // this.props.setNotification(message)
          })

          JPushModule.addReceiveOpenNotificationListener(openNotificationListener)
          JPushModule.addReceiveNotificationListener(receiveNotificationListener)
        }
      })
    } else {
      JPushModule.setupPush()
      JPushModule.addReceiveCustomMsgListener((message) => {
        console.tron.log('JPushMessageReceived: ', message)
        // this.props.setNotification(message)
      })

      JPushModule.addReceiveOpenNotificationListener(openNotificationListener)
      JPushModule.addReceiveNotificationListener(receiveNotificationListener)
    }

}


openNotificationListener = map => {
  console.tron.log('Opening notification!')
  console.tron.log('alertContent: ' + map.alertContent)
  console.tron.log('map.extra: ' + map.extras)

  if(!!map.extras){
    let extras  = (typeof(map.extras) === 'string') ? JSON.parse(map.extras): map.extras
    let { openType, gameId } = extras

    console.tron.log('notification openType is', openType)

    switch (openType) {
      case 'game':
        notificationStatusChannel.put(NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'BottomTab',
              action: NavigationActions.navigate({ routeName: 'Game' })
            }),
          ]
        }))
        break;
      case 'record':
        notificationStatusChannel.put(NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'BottomTab',
              action: NavigationActions.navigate({ routeName: 'Record' })
            }),
          ]
        }))
        break;
      case 'promotion':
        notificationStatusChannel.put(NavigationActions.navigate({routeName: 'PromotionScreen'}))
        break;
      case 'gameContainer':

        switch (gameId) {
          case 2:
            notificationStatusChannel.put(GameActions.setGameKey(gameId))
            notificationStatusChannel.put(BetActions.loadCoin())
            break;
          case 6:
            notificationStatusChannel.put(GameActions.setGameKey(gameId))
            notificationStatusChannel.put(BetActions.loadOneDice())
            break;
          case 36:
            notificationStatusChannel.put(GameActions.setGameKey(gameId))
            notificationStatusChannel.put(BetActions.loadTwoDice())
            break;
          case 100:
            notificationStatusChannel.put(GameActions.setGameKey(gameId))
            notificationStatusChannel.put(BetActions.loadEtheroll())
            break;
          default:

            notificationStatusChannel.put(GameActions.setGameKey(2))
            notificationStatusChannel.put(BetActions.loadCoin())
            break;
        }

        notificationStatusChannel.put(NavigationActions.navigate({routeName: 'GameContainerScreen'}))
        break;

      default: break;
    }

  }







}

receiveNotificationListener = map => {
  console.tron.log('alertContent: ' + map.alertContent)
  console.tron.log('extras: ' + map.extras)
}
