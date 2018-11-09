import React, { Component } from 'react'
import { ScrollView, Button, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/WalletManageScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import PwdModalActions from '../Redux/PwdModalRedux'
import WalletActions from '../Redux/WalletRedux'
import I18n from '../I18n'

class WalletManageScreen extends Component {


  static navigationOptions = ({navigation}) => {
    return {
      title: I18n.t('Wallet'),
      headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
    }
  }



  _backup() {
    let { openPwdModal } = this.props
    let submitedActions = [{
        action: WalletActions.encryptWallet,
        data: {
          successActions: [{
              action: NavigationActions.navigate,
              data: { routeName: 'BackupKeystoreScreen' }
            }]
        }
      }]

    openPwdModal({
      submitedActions
    })

  }



  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonWrapper} onPress={_ => this.props.navigate('NewWalletScreen')}>
          <Text style={styles.buttonText}> {I18n.t('NewWallet')} </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrapper} onPress={_ => this.props.navigate('ImportWalletScreen')}>
          <Text style={styles.buttonText}> {I18n.t('ImportWallet')} </Text>
        </TouchableOpacity>
        {!!W.address && <TouchableOpacity style={styles.buttonWrapper} onPress={_ => this.props.navigate('ChannelScreen')}>
          <Text style={styles.buttonText}> {I18n.t('Channel')} </Text>
        </TouchableOpacity>}
        {!!W.address && <TouchableOpacity style={styles.buttonWrapper} onPress={this._backup.bind(this)}>
          <Text style={styles.buttonText}> {I18n.t('BackupWallet')} </Text>
        </TouchableOpacity>}
        {!!W.address && <TouchableOpacity style={styles.buttonWrapper} onPress={_ => this.props.navigate('TransferScreen')}>
          <Text style={styles.buttonText}> {I18n.t('Transfer')} </Text>
        </TouchableOpacity>}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    openPwdModal: (data) => dispatch(PwdModalActions.openPwdModal(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletManageScreen)
