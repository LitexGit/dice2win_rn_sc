import React, { Component } from 'react'
import { View, StatusBar, Platform } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import WalletActions from '../Redux/WalletRedux'
import NotificationActions from '../Redux/NotificationRedux'
import ConfigActions from '../Redux/ConfigRedux'
import ReduxPersist from '../Config/ReduxPersist'
import JPushModule from 'jpush-react-native'
<<<<<<< Updated upstream
import RNFS from 'react-native-fs';
import {Wallet} from 'ethers'
=======
import SocketIOClient from 'socket.io-client'
>>>>>>> Stashed changes


// Styles
import styles from './Styles/RootContainerStyles'

global.socket = null
global.W = null

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
    this.props.initSocket(this.props.config.ws)
    this.props.initWallet()
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
const mapStateToProps = (state) => ({
  config: state.config.payload
})

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  initSocket: (address) => dispatch(ConfigActions.socketInit(address)),
  initWallet: () => dispatch(WalletActions.initWallet()),
  setNotification: (message) => dispatch(NotificationActions.notificationSuccess({message: message}))
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
