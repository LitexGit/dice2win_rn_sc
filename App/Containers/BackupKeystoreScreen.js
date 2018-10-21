import React, { Component } from 'react'
import { ScrollView, Text, View, TextInput, Clipboard } from 'react-native'
import { connect } from 'react-redux'
import QR from 'react-native-qrcode-svg'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/BackupKeystoreScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'
import MessageBoxActions from '../Redux/MessageBoxRedux'
import Toast from 'react-native-root-toast'
import I18n from '../I18n'

class BackupKeystoreScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: I18n.t('BackupWallet'),
    }
  }

  _copyKeystore () {
    let {keystore} = this.props
    Clipboard.setString(keystore)
    Toast.show(I18n.t('KeystoreCopied'), {
      position: Toast.positions.CENTER,
    })
  }

  componentDidMount () {
    // this.props.openPwdModal()
    this.props.alert(I18n.t('BackupKeystoreWarning'))
  }

  render () {
    let {keystore} = this.props
    console.tron.log('BackupKeystoreScreen keystore', W)
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{I18n.t('ExportKeystore')}</Text>
          </View>
          <View>
            <Text style={styles.keystore} onPress={_ => this._copyKeystore()}>
              {keystore}
            </Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.headerText}>{I18n.t("QR")}</Text>
          </View>

          <View style={styles.qr}>
            {!!keystore &&
              <QR value={keystore} size={200} 
                color={Colors.neetGray}
                backgroundColor={Colors.steel}/>}
          </View>
        </View>
        {/* <BackupKeystoreWarningModal/> */}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {keystore: state.wallet.keystore}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    // openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),
    alert: (message) => dispatch(MessageBoxActions.openMessageBox({ title: 'Warning', message }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupKeystoreScreen)
