import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, Clipboard, RefreshControl, Linking, Share } from 'react-native'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import QR from 'react-native-qrcode-svg'
import Toast from 'react-native-root-toast'

import WalletActions from '../Redux/WalletRedux'
import UserActions from '../Redux/UserRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import { Metrics, Colors } from '../Themes'
import styles from './Styles/WalletScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'

class WalletScreen extends Component {
  static navigationOptions = {
    title: 'Wallet',
    tabBarLabel: 'Wallet',
    tabBarIcon: ({tintColor}) => (
      <FA5 name={'wallet'} size={Metrics.bottomTabIconSize} color={tintColor}/>
    )
  }

  componentWillMount () {
    console.tron.log('WalletScreen componentDidMount', W)

    if(!W.address){
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 1,
        actions:[ 
          NavigationActions.navigate({routeName:'BottomTab'}),
          NavigationActions.navigate({routeName:'WalletManageScreen'}),
        ]
      }))
    }
  }

  componentDidMount () {

    this.props.loadWallet()
    // temporary put register here
    !this.props.user.uid && this.props.register(W.address)
  }

  _copyAddress = () => {
    Clipboard.setString(this.props.wallet.address)
    Toast.show('address copied', {
      position: Toast.positions.CENTER,
    })
  }

  _copyCode = () => {
    Clipboard.setString(this.props.wallet.code)
    Toast.show('code copied', {
      position: Toast.positions.CENTER,
    })
  }

  _shareLink = () => {
    let {message, title, url} = this.props.shareInfo
    Share.share({message: message, title: title, url: url})
      .then(result => {console.tron.log('share result: ', result)})
      .catch(err => console.tron.log('error open telegram', err))
  }

  _onRefresh = () => {
    this.props.loadWallet()
  }

  _goto = (where) => {
    switch (where) {
      case 'settings':
        this.props.navigate('SettingScreen')
        break
      case 'wallet':
        this.props.navigate('WalletManageScreen')
        break
      case 'promotion':
        this.props.navigate('PromotionScreen')
        break
      case 'telegram':
        this._openTelegram()
        break
      case 'faq':
        this._openFAQ()
        break
    }
  }

  _openTelegram = () => {
    let {telegroup} = this.props
    Linking.canOpenURL(telegroup).then(supported => {
      if (supported) {
        alert('Can\'t open Telegram')
      } else {
        return Linking.openURL(telegroup)
      }
    }).catch(err => console.tron.log('error open telegram', err))
  }

  _openFAQ = () => {
    this.props.navigate('WebviewScreen', {title: 'FAQ', url: this.props.faq})
  }

  _checkUpdate = () => {

  }

  render () {
    let {wallet, user} = this.props
    return (
      <ScrollView style={styles.container} refreshControl={<RefreshControl
        refreshing={this.props.fetching}
        onRefresh={this._onRefresh}
        tintColor={Colors.tintColor}
        title="Refreshing..."
        titleColor={Colors.text}/>}>
        <View style={styles.walletWrapper}>
          <View style={styles.walletEditWrapper}>
            <TouchableOpacity onPress={_ => this._goto('wallet')}><Feather style={styles.walletEdit} name={'edit'}
                                                                           size={24}/></TouchableOpacity>
          </View>
          <View style={styles.balanceWrapper}>
            <Text style={styles.balance}>{wallet.balance}</Text>
            <Text style={styles.unit}> ETH</Text>
          </View>
          <View style={styles.qr}>{wallet.address &&
          <QR value={wallet.address} size={120} color={Colors.silver} backgroundColor={Colors.casinoBlue}/>}</View>
          <TouchableOpacity style={styles.addressWrapper} onPress={_ => this._copyAddress()}>

            <Text style={styles.addressText}>{wallet.address}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.shareWrapper}>
          <TouchableOpacity style={styles.shareUp} onPress={_ => this._goto('promotion')}>
            <Text style={styles.label}>promotion bonus</Text>
            <View style={[styles.balanceWrapper, styles.bonusBalanceWrapper]}>
              <Text style={styles.bonus}>{user.bonus}</Text>
              <Text style={styles.unit}> ETH</Text>
            </View>
            <View style={styles.bonusDetailWrapper}>
              <Text style={styles.bonusDetailText}><Entypo name={'chevron-thin-right'} size={28} color={Colors.cloud}/></Text>
            </View>
          </TouchableOpacity>
          <View style={styles.shareDown}>
            <View style={styles.codeWrapper}>
              <Text style={styles.label}>promotion code: </Text>
              <Text style={styles.code}>{user.code}</Text>
            </View>
            <View style={styles.actionsWrapper}>
              <TouchableOpacity onPress={_ => this._copyCode()} style={styles.actionWrapper}><Text
                style={styles.action}>Copy Code</Text></TouchableOpacity>
              <TouchableOpacity onPress={_ => this._shareLink()} style={styles.actionWrapper}><Text
                style={styles.action}>Share Link</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={_ => this._checkUpdate()}>
            <Text style={styles.buttonText}>Version</Text>
            <Text style={styles.buttonText}>1.0.0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={_ => this._goto('faq')}>
            <Text style={styles.buttonText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={_ => this._goto('telegram')}>
            <Text style={styles.buttonText}>Telegram</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={_ => this._goto('settings')}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.wallet.fetching,
    wallet: state.wallet,
    telegroup: state.config.telegroup,
    user: state.user,
    faq: state.config.faq,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadWallet: () => dispatch(WalletActions.walletRequest()),
    register: (address) => dispatch(UserActions.register({address})),
    navigate: (target, params) => dispatch(NavigationActions.navigate({routeName: target, params: params})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen)
