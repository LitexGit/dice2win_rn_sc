import React, { Component } from 'react'
import { View, StatusBar, SafeAreaView, Platform } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import NotificationActions from '../Redux/NotificationRedux'
import ReduxPersist from '../Config/ReduxPersist'
import JPushModule from 'jpush-react-native'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }

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
          JPushModule.addReceiveCustomMsgListener((message) => {
            console.tron.log('JPushMessageReceived: ', message)
            this.props.setNotification(message)
          })
        }
      })
    } else {
      JPushModule.setupPush()
    }


  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
          <ReduxNavigation />
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  setNotification: (message) => dispatch(NotificationActions.notificationSuccess({message: message}))
})

export default connect(null, mapDispatchToProps)(RootContainer)
