import React, { Component } from 'react'
import { Text, TouchableOpacity, View, Alert } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import WalletActions from '../Redux/WalletRedux'

// Styles
import styles from './Styles/NewWalletScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import DoublePwdInput from '../Components/DoublePwdInput'
import MessageBoxActions from '../Redux/MessageBoxRedux'
import I18n from '../I18n'

// var ethers = require('../Lib/ethers')

class NewWalletScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: I18n.t('NewWallet'),
      headerLeft: null,
    }
  }

  componentDidMount () {
    // this.props.newWallet()
  }

  _checkPwd () {

    let { alert, pwdValid } = this.props
    
    if(!pwdValid) {
      alert(I18n.t('PwdInvalid'))
      return
    }

    if (!!this.props.pwd1 && this.props.pwd1 === this.props.pwd2) {
      this.props.newWallet()
      this.props.navigate('PreBackupScreen')
    } else {
      alert(I18n.t('PwdDismatch'))
    }
  }

  render () {

    let {mnemonic, back} = this.props

    return (

      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>{I18n.t('CreatePwd')}</Text>
        </View>
        <DoublePwdInput focus={false} />
        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.cancelButton} onPress={_=>Alert.alert(I18n.t('Attention'), I18n.t('DiscardWallet'), [
            {text: I18n.t('LeavePage'), onPress: back, style: 'cancel'},
            {text: I18n.t('ContinueCreation'), style:'default'},
          ])}>
            <Text style={styles.label}> {I18n.t('Cancel')} </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={this._checkPwd.bind(this)}>
            <Text style={styles.label}> {I18n.t('Confirm')} </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mnemonic: state.wallet.wallet.mnemonic,
    pwd1: state.doublePwdInput.pwd1,
    pwd2: state.doublePwdInput.pwd2,
    pwdValid: state.doublePwdInput.pwd1valid,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    newWallet: () => dispatch(WalletActions.newWallet()),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    back: () => dispatch(NavigationActions.back()),
    alert: (message) => dispatch(MessageBoxActions.openMessageBox({ title: 'Warning', message }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewWalletScreen)
