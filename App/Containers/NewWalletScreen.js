import React, { Component } from 'react'
import { Button, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import WalletActions from '../Redux/WalletRedux'

// Styles
import styles from './Styles/NewWalletScreenStyle'
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

  componentDidMount () {
    this.props.newWallet()
  }

  _checkPwd () {
    if (this.props.pwd1 === this.props.pwd2) {
      this.props.navigate('PreBackupScreen')
    } else {
      alert('passwords do not match')
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
        <DoublePwdInput focus={false}/>
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
    mnemonic: state.wallet.wallet.mnemonic,
    pwd1: state.doublePwdInput.pwd1,
    pwd2: state.doublePwdInput.pwd2,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    newWallet: () => dispatch(WalletActions.newWallet()),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    back: () => dispatch(NavigationActions.back()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewWalletScreen)
