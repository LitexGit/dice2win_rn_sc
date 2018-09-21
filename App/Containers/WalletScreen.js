import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, Clipboard} from 'react-native'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import QR from 'react-native-qrcode'
import Toast from 'react-native-root-toast'

import WalletActions from '../Redux/WalletRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/WalletScreenStyle'

class WalletScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Wallet',
    tabBarIcon:({tintColor}) => (
      <FA5 name={'wallet'} size={26} color={tintColor}/>
    )
  }

  componentDidMount(){
    this.props.loadWallet()
  }

  _copyAddress = () => {
    Clipboard.setString(this.props.wallet.address)
    Toast.show('address copied')
  }

  render () {
    let {wallet} = this.props
    return (
      <ScrollView style={styles.container}>
        <View style={styles.walletWrapper}>
          <QR style={styles.qr} value={wallet.address} size={120} bgColor='purple' />
          <TouchableOpacity style={styles.addressWrapper} onPress={_=>this._copyAddress()}>
            <Text style={styles.addressText}>{wallet.address}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    wallet: state.wallet.payload
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadWallet: () => dispatch(WalletActions.walletRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen)
