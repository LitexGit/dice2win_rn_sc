import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PreBackupScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import I18n from '../I18n'

class PreBackupScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: I18n.t('BackupMnemonic'),
    }
  }

  render () {

    let {mnemonic} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>{I18n.t('BackupMnemonic')+'\n'}</Text>
        </View>
        <Text style={styles.infoText}>
          {I18n.t('MnemonicWarning1')+'\n'}
        </Text>
        <Text style={styles.infoText}>
          {I18n.t('MnemonicWarning2')+'\n'}
        </Text>
        <Text style={styles.infoText}>
          {I18n.t('MnemonicWarning3')+'\n'}
        </Text>
        <Text style={styles.mnemonicText}>
          {mnemonic}</Text>
        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.confirmButton} onPress={() => this.props.navigate('BackupScreen')}>
            <Text style={styles.label}> {I18n.t('Next')} </Text>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreBackupScreen)
