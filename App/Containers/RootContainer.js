import React, { Component } from 'react'
import { View, StatusBar, Platform } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import NotificationActions from '../Redux/NotificationRedux'
import ReduxPersist from '../Config/ReduxPersist'
import JPushModule from 'jpush-react-native'
import SocketIOClient from 'socket.io-client'

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
    initSocket(this.props.config.ws)
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

const initWallet = () => {
  if(!W){
    
  }
}

const initSocket = (address) => {
  if(!socket){
    socket = SocketIOClient(address)
      .on('connect', socketConnected)
      .on('settle', socketMessage)
      .on('error', socketError)
      .on('disconnect', socketClosed)
  }
}

const socketConnected = () => {
  console.tron.log('Socket OPEN')
}

const socketMessage = (msg) => {
  console.tron.log('Socket MSG:', msg)
}

const socketError = (err) => {
  console.tron.log('Socket ERROR:', err.message)
}

const socketClosed = (e) => {
  console.tron.log('Socket CLOSE', e)
}

// wraps dispatch to create nicer functions to call within our component
const mapStateToProps = (state) => ({
  config: state.config.payload
})

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  setNotification: (message) => dispatch(NotificationActions.notificationSuccess({message: message}))
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
