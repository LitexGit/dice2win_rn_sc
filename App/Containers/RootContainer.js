import React, { Component } from 'react'
import { View, StatusBar, Platform } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import WalletActions from '../Redux/WalletRedux'
import NotificationActions from '../Redux/NotificationRedux'
import ConfigActions from '../Redux/ConfigRedux'
import ReduxPersist from '../Config/ReduxPersist'
import ConfirmModal from '../Components/ConfirmModal'
import PwdModal from '../Components/PwdModal'


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




    /* AFTER API Setup */
    this.props.initSocket(this.props.ws)
    this.props.initNotification()
    this.props.initWallet()


  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
          <ReduxNavigation />
          <ConfirmModal />
          <PwdModal />
      </View>
    )
  }
}


// wraps dispatch to create nicer functions to call within our component
const mapStateToProps = (state) => ({
  uid: state.user.uid,
  ws: state.config.ws
})

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  initSocket: (address) => dispatch(ConfigActions.socketInit(address)),
  initWallet: () => dispatch(WalletActions.initWallet()),
  unlockWallet: (password) => dispatch(WalletActions.unlockWallet({password})),
  // setNotification: (message) => dispatch(NotificationActions.notificationSuccess({message: message})),
  initNotification: () => dispatch(NotificationActions.initNotification())
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
