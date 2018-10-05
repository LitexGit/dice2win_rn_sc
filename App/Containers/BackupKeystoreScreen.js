import React, { Component } from 'react'
import { ScrollView, Text, View, TextInput } from 'react-native'
import { connect } from 'react-redux'
import QR from 'react-native-qrcode-svg'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/BackupKeystoreScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'
import PwdModal from '../Components/PwdModal';
import PwdModalActions from '../Redux/PwdModalRedux'
import WalletActions from '../Redux/WalletRedux'

class BackupKeystoreScreen extends Component {

  componentDidMount(){
    this.props.openPwdModal()
  }


  render() {

    let { keystore } = this.props
    console.tron.log('BackupKeystoreScreen keystore', W)
    return (
      <ScrollView style={styles.container}>
        <Text style={{
          marginTop: 20,
          fontSize: 16,
          color: Colors.text,
        }}>export keystore file: </Text>
        <TextInput
          multiline
          style={{
          marginTop: 20,
          fontSize: 16,
          color: Colors.text,
        }}>{keystore}</TextInput>
        <Text style={{
          marginTop: 20,
          fontSize: 16,
          color: Colors.text,
        }}>Qrcode</Text>

        <View style={styles.qr}>{!!keystore &&
          <QR value={keystore} size={120} color={Colors.silver} backgroundColor={Colors.casinoBlue} />}</View>

        <PwdModal onCancel={_ => this.props.navigate('WalletManageScreen')}
          onSubmit={(password) => {this.props.unlockWallet(password)}}
        />
      </ScrollView>

    )
  }
}

const mapStateToProps = (state) => {
  return { keystore: JSON.stringify(W.keystore)}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({ routeName: target })),
    openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),
    unlockWallet: (password) => dispatch(WalletActions.unlockWallet({password})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupKeystoreScreen)
