import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, Clipboard, RefreshControl } from 'react-native'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import QR from 'react-native-qrcode-svg'
import Toast from 'react-native-root-toast'

import WalletActions from '../Redux/WalletRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import { Metrics, Colors } from '../Themes'
import styles from './Styles/WalletScreenStyle'

class WalletScreen extends Component {
  static navigationOptions = {
    title: 'Wallet',
    tabBarLabel: 'Wallet',
    tabBarIcon:({tintColor}) => (
      <FA5 name={'wallet'} size={Metrics.bottomTabIconSize} color={tintColor}/>
    )
  }

  componentDidMount(){
    this.props.loadWallet()
  }

  _copyAddress = () => {
    Clipboard.setString(this.props.wallet.address)
    Toast.show('address copied')
  }

  _onRefresh = () => {
    this.props.loadWallet()
  }

  render () {
    let {wallet} = this.props
    return (
      <ScrollView style={styles.container} refreshControl={<RefreshControl
          refreshing={this.props.fetching}
          onRefresh={this._onRefresh}
          tintColor={Colors.tintColor}
          title="Refreshing..."
          titleColor={Colors.text} />}>
        <View style={styles.walletWrapper}>
          <View style={styles.balanceWrapper}>
            <Text style={styles.balance}>{wallet.balance}</Text>
            <Text style={styles.unit}> ETH</Text>
          </View>
          <View style={styles.qr}><QR value={wallet.address} size={120} color={Colors.silver} backgroundColor={Colors.casinoBlue} /></View>
          <TouchableOpacity style={styles.addressWrapper} onPress={_=>this._copyAddress()}>
            <Text style={styles.addressText}>{wallet.address}</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.divider} /> */}
        <View style={styles.shareWrapper}>
          <TouchableOpacity style={styles.shareUp}>
            <Text style={styles.label}>promotion bonus</Text>          
            <View style={[styles.balanceWrapper, styles.bonusBalanceWrapper]}>
              <Text style={styles.bonus}>{wallet.bonus}</Text>
              <Text style={styles.unit}> ETH</Text>
            </View>
            <View style={styles.bonusDetailWrapper}>
              <Text style={styles.bonusDetailText}><Entypo name={'chevron-thin-right'} size={28} color={Colors.cloud} /></Text>
            </View>
          </TouchableOpacity>
          <View style={styles.shareDown}>>
            <View style={styles.codeWrapper}>
              <Text style={styles.label}>promotion code:  </Text>
              <Text style={styles.code}>{wallet.code}</Text>
            </View>
            <View style={styles.actionsWrapper}>
              <TouchableOpacity style={styles.actionWrapper}><Text style={styles.action}>Copy Code</Text></TouchableOpacity>
              <TouchableOpacity style={styles.actionWrapper}><Text style={styles.action}>Share Link</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={this._goSetting}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this._goSetting}>
            <Text style={styles.buttonText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this._goSetting}>
            <Text style={styles.buttonText}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this._goSetting}>
            <Text style={styles.buttonText}>Version</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.wallet.fetching,
    wallet: state.wallet.payload
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadWallet: () => dispatch(WalletActions.walletRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen)
