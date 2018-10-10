import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PreBackupScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'
import WalletActions from '../Redux/WalletRedux'

class PreBackupScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Back up your mnemonic',
    }
  }

  componentDidMount () {
    // this.props.openNewPwdModal()
    this.props.newWallet()
  }

  render () {

    let {mnemonic} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Back up your mnemonic</Text>
        </View>
        <Text style={styles.infoText}>
          {'      Please record the mnemonic of your wallet and save it to a safe place. '}
          </Text>
        <Text style={styles.infoText}>
          {'      Wallet mnemonics are used to recover your account. Do not reveal' +
          ' your mnemonics at any time. It is recommended not to use screen captures to' +
          ' save it or transfer it via internet tools.'}
        </Text>
        <Text style={styles.mnemonicText}>
          {mnemonic}</Text>
        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.confirmButton} onPress={() => this.props.navigate('BackupScreen')}>>
            <Text style={styles.label}> Next </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // mnemonic: W.wallet.mnemonic
    mnemonic: state.wallet.wallet.mnemonic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    newWallet: () => dispatch(WalletActions.newWallet()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreBackupScreen)
