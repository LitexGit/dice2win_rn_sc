import React, { Component } from 'react'
import { Button, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import WalletActions from '../Redux/WalletRedux'
import NewPwdModalActions from '../Redux/NewPwdModalRedux'

// Styles
import styles from './Styles/NewWalletScreenStyle'
import NewPwdInput from '../Components/NewPwdInput'
import Colors from '../Themes/Colors'
import NavigationActions from 'react-navigation/src/NavigationActions'
import DoublePwdInput from '../Components/DoublePwdInput'

// var ethers = require('../Lib/ethers')

class NewWalletScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Create a Wallet',
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      pwd1: '12',
      pwd2: '12'
    }
  }

  componentDidMount () {
    // this.props.openNewPwdModal()
    // this.props.newWallet()
  }

  _checkPwd () {
    if (this.state.pwd1 === this.state.pwd2) {
      this.props.setPwd(this.state.pwd2)
      this.props.navigate('PreBackupScreen')
    } else {
      alert('密码不一致！')
    }
  }

  render () {

    let {mnemonic} = this.props

    console.tron.log('New Wallet props', this.props)

    return (

      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Create you password </Text>
        </View>
        <DoublePwdInput/>
        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.cancelButton} onPress={this.props.navigate.back}>
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
    mnemonic: state.wallet.wallet.mnemonic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    setPwd: (pwd) => dispatch(NewPwdModalActions.setPwd(pwd)),
    newWallet: () => dispatch(WalletActions.newWallet()),
    openNewPwdModal: () => dispatch(NewPwdModalActions.openNewPwdModal()),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    back: () => dispatch(NavigationActions.back()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewWalletScreen)
