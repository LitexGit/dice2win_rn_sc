import React, { Component } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ImportWalletStyle'
import WalletActions from '../Redux/WalletRedux'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'
import NewPwdModal from '../Components/NewPwdModal'
import NewPwdModalActions from '../Redux/NewPwdModalRedux'

import PwdModal from '../Components/PwdModal'
import PwdModalActions from '../Redux/PwdModalRedux'

let ethers = require('ethers')

class ImportWallet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mnemonic: 'taxi reward file cattle canoe orbit uniform civil tourist sun donkey need',

      keystore: {
        'address': '3592c9b187ebc70d6537c64bf5927eee31d2a2d3',
        'id': '196b56cb-49e6-479a-b7e8-c51bb8f2afb6',
        'version': 3,
        'crypto': {
          'cipher': 'aes-128-ctr',
          'cipherparams': {'iv': '08552e27860bf4e552f8b59a704af7d9'},
          'ciphertext': '82d456bcc57ccfd15056ad79e6b1bd5ceccaeaaeb3aab0f0109231fef4109ddd',
          'kdf': 'scrypt',
          'kdfparams': {
            'salt': 'cb4ed514ba306351ac7dcbd800e6bc8bba3f4b238fcc50b866c4e67dc3609a9a',
            'n': 131072,
            'dklen': 32,
            'p': 1,
            'r': 8
          },
          'mac': '062867cf52e4cb2b84e51295cc73b13faaf2769b365e48b41d28489a51735a3f'
        },
        'x-ethers': {
          'client': 'ethers.js',
          'gethFilename': 'UTC--2018-09-27T07-55-02.0Z--3592c9b187ebc70d6537c64bf5927eee31d2a2d3',
          'mnemonicCounter': '41f7e177bb820078046d63c7e7148b72',
          'mnemonicCiphertext': '7a919d8c96cdd37147379ff4f2f64fb6',
          'version': '0.1'
        }
      }
    }
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Text style={{
          marginTop: 20,
          fontSize: 16,
          color: Colors.text
        }}>助记词</Text>
        <TextInput
          multiline
          numberOfLines={5}
          placeholder='输入助记词'
          style={{
            marginTop: 20,
            fontSize: 16,
            height: 150,
            border: 2,
            color: Colors.text
          }}
          value={this.state.mnemonic}
          onChangeText={(mnemonic) => this.setState({mnemonic})} />
        <TouchableOpacity full dark style={{marginTop: 20}} onPress={() => {
          this.props.openNewPwdModal()
          var mnemonic = this.state.mnemonic
          this.props.importWallet(mnemonic)
        }}>
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            color: Colors.text
          }}>助记词导入</Text>
        </TouchableOpacity>
        <Text style={{
          marginTop: 20,
          fontSize: 16,
          color: Colors.text
        }}>keystore</Text>
        <TextInput
          multiline
          numberOfLines={5}
          placeholder='输入keystore'
          style={{
            marginTop: 20,
            fontSize: 16,
            height: 150,
            border: 2,
            color: Colors.text
          }}
          value={JSON.stringify(this.state.keystore)}
          onChangeText={(keystore) => this.setState({keystore})} />
        <TouchableOpacity full dark style={{marginTop: 20}} onPress={() => {
          this.props.openPwdModal()
          var keystore = this.state.keystore
          this.props.setKeystore(keystore)
        }}>
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            color: Colors.text
          }}>keystore导入</Text>
        </TouchableOpacity>
        <PwdModal />
        <NewPwdModal navigateName={'BottomTab'} />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pwd: state.newPwdModal.pwd2
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    importWallet: (mnemonic) => dispatch(WalletActions.importWallet({mnemonic})),
    importEncryptWallet: (data) => dispatch(WalletActions.importEncryptWallet(data)),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    openNewPwdModal: () => dispatch(NewPwdModalActions.openNewPwdModal()),
    openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),
    setKeystore: (data) => dispatch(WalletActions.setKeystore(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportWallet)
