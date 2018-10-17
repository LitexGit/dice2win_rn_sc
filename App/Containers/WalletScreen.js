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
    title: 'Account',
    tabBarLabel: 'Account',
    tabBarIcon: ({tintColor}) => (
      <FA5 name={'user'} size={Metrics.bottomTabIconSize} color={tintColor}/>
    )
  }

  constructor (props) {
    super(props)

    console.tron.log('WalletScreen componentDidMount', W)

    if(!W.address){
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 1,
        actions:[
          NavigationActions.navigate({routeName:'BottomTab'}),
          NavigationActions.navigate({routeName:'WalletManageScreen'}),
        ]
      }))
    } else {
      // TODO temporary put register here
      !props.uid && props.register(W.address)
    }
  }

  componentDidMount () {
    let {loadWallet, loadUser, uid} = this.props
    loadWallet()
    uid && loadUser(uid)
  }

  _copyAddress = () => {
    let {address} = this.props
    Clipboard.setString(address)
    Toast.show('address copied', {
      position: Toast.positions.CENTER,
    })
  }

  _copyCode = () => {
    let {code} = this.props
    Clipboard.setString(code)
    Toast.show('code copied', {
      position: Toast.positions.CENTER,
    })
  }

  _shareLink = () => {
    let {shareInfo:{message, title, url}, share_url} = this.props
    let msg = message + "\r\n Download Url: " + share_url
    Share.share({message : msg, title, url})
      .then(result => {console.tron.log('share result: ', result)})
      .catch(err => console.tron.log('error open telegram', err))
  }

  _onRefresh = () => {
    this.props.loadWallet()
  }

  _goto = (where) => {
    let {navigate} = this.props
    switch (where) {
      case 'settings': navigate('SettingScreen'); break
      case 'wallet': navigate('WalletManageScreen'); break
      case 'promotion': navigate('PromotionScreen'); break
      case 'telegram': this._openTelegram(); break
      case 'faq': this._openFAQ(); break
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
    let {faq, navigate} = this.props
    navigate('WebviewScreen', {title: 'FAQ', url: faq})
  }

  _checkUpdate = () => {

  }

  render () {
    let {fetching, balance, address, bonus, code} = this.props
    return <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={fetching} onRefresh={this._onRefresh} tintColor={Colors.tintColor} title="Refreshing..." titleColor={Colors.text} />}>
        <View style={styles.walletWrapper}>
          <View style={styles.walletEditWrapper}>
            <TouchableOpacity style={styles.walletButton} onPress={_ => this._goto("wallet")}>
              <FA5 name={"wallet"} size={24} style={styles.walletIcon} />
              <Text style={styles.walletText}>wallet</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.balanceWrapper}>
            <Text style={styles.balance}>{balance}</Text>
            <Text style={styles.unit}> ETH</Text>
          </View>
          <View style={styles.qr}>
            {!!address && (
              <QR
                value={address}
                size={100}
                color={Colors.neetGray}
                backgroundColor={Colors.steel}
              />
            )}
          </View>
          <Text style={styles.addressText}>{address}</Text>
          <TouchableOpacity style={styles.addressWrapper} onPress={_ => this._copyAddress()}>
            <Text style={styles.addressText}>Copy address</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.shareWrapper}>
          <TouchableOpacity style={styles.shareUp} onPress={_ => this._goto("promotion")}>
            <Text style={styles.label}>Referral bonus</Text>
            <View style={[styles.balanceWrapper, styles.bonusBalanceWrapper]}>
              <Text style={styles.bonus}>{bonus}</Text>
              <Text style={styles.unit}> ETH</Text>
            </View>
            <View style={styles.bonusDetailWrapper}>
              <Text style={styles.bonusDetailText}>
                <Entypo name={"chevron-thin-right"} size={28} color={Colors.cloud} />
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.shareDown}>
            <View style={styles.codeWrapper}>
              <Text style={styles.label}>Referral code: </Text>
              <Text style={styles.code}>{code}</Text>
            </View>
            <View style={styles.actionsWrapper}>
              <TouchableOpacity onPress={_ => this._copyCode()} style={styles.actionWrapper}>
                <Text style={styles.action}>Copy code</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={_ => this._shareLink()} style={styles.actionWrapper}>
                <Text style={styles.action}>Share link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity style={[styles.button, { borderWidth: 0 }]} onPress={_ => this._checkUpdate()}>
              <Text style={styles.buttonText}>Version</Text>
              <Text style={styles.buttonText}>1.0.0</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity style={[styles.button, { borderWidth: 0 }]} onPress={_ => this._goto("faq")}>
              <Text style={styles.buttonText}>FAQ</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity style={[styles.button, { borderWidth: 0 }]} onPress={_ => this._goto("telegram")}>
              <Text style={styles.buttonText}>Telegram</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity style={[styles.button, { borderWidth: 0 }]} onPress={_ => this._goto("settings")}>
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>;
  }
}

const mapStateToProps = (state) => {
  let {
    wallet: {fetching, address, balance},
    user: {uid, bonus, code, share_url},
    config: {telegroup, shareInfo, faq},
  } = state
  balance && (balance = balance.toFixed(6))
  bonus && (bonus = parseFloat(parseFloat(bonus).toFixed(6))) // TODO maybe backend can pass bonus as a number
  return {
    fetching, address, balance,
    uid, bonus, code, share_url,
    telegroup, shareInfo, faq,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadWallet: () => dispatch(WalletActions.walletRequest()),
    loadUser: (uid) => dispatch(UserActions.userRequest(uid)),
    register: (address) => dispatch(UserActions.register({address})),
    navigate: (target, params) => dispatch(NavigationActions.navigate({routeName: target, params: params})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen)
