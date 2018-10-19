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

// var ethers = require('../Lib/ethers')

class NewWalletScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'New Wallet',
      headerLeft: null,
    }
  }

  componentDidMount () {
    // this.props.newWallet()
  }

  _checkPwd () {

    let { alert, pwdValid } = this.props
    
    if(!pwdValid) {
      alert('password format invalid')
      return
    }

    if (!!this.props.pwd1 && this.props.pwd1 === this.props.pwd2) {
      this.props.newWallet()
      this.props.navigate('PreBackupScreen')
    } else {
      alert('passwords do not match')
    }
  }

  render () {

    let {mnemonic, back} = this.props

    return (

      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Create you password </Text>
        </View>
        <DoublePwdInput focus={false} />
        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.cancelButton} onPress={_=>Alert.alert('Attention', 'This will cancel the wallet creation, do you want to leave?', [
            {text: 'Leave page', onPress: back, style: 'cancel'},
            {text: 'Continue wallet creation', style:'default'},
          ])}>
            <Text style={styles.label}> Cancel </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={this._checkPwd.bind(this)}>
            <Text style={styles.label}> Confirm </Text>
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
