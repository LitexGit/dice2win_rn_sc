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
import MessageBox from '../Components/MessageBox'
import {
  GoogleAnalyticsTracker,
  GoogleTagManager,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge'
import I18n from '../I18n'


// Styles
import styles from './Styles/RootContainerStyles'

global.socket = null
global.W = {}
global.ApiSauceObj= null
global.tracker = null

class RootContainer extends Component {
  componentDidMount () {
    let {trackId} = this.props
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
    // get global config from server
    this.props.configRequest({locale: I18n.currentLocale()});

    // GA settings
    tracker = new GoogleAnalyticsTracker(trackId)
    console.tron.log('TrackerInit:', tracker)
    GoogleAnalyticsSettings.setDryRun(false) // [true] to disable tracking while developing

    // init wallet even network disconnect
    this.props.initWallet();
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
          <ReduxNavigation />
          <ConfirmModal />
          <PwdModal />
          <MessageBox />

      </View>
    )
  }
}


// wraps dispatch to create nicer functions to call within our component
const mapStateToProps = (state) => ({
  uid: state.user.uid,
  ws: state.config.ws,
  trackId: state.config.trackId,
})

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  initSocket: (address) => dispatch(ConfigActions.socketInit(address)),
  initWallet: () => dispatch(WalletActions.initWallet()),
  unlockWallet: (password) => dispatch(WalletActions.unlockWallet({password})),
  // setNotification: (message) => dispatch(NotificationActions.notificationSuccess({message: message})),
  initNotification: () => dispatch(NotificationActions.initNotification()),
  configRequest: (data) => dispatch(ConfigActions.configRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
