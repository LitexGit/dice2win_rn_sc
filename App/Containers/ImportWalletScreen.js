import React, { Component } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ImportWalletScreenStyle'
import WalletActions from '../Redux/WalletRedux'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'
import NewPwdModal from '../Components/NewPwdModal'
import NewPwdModalActions from '../Redux/NewPwdModalRedux'

import PwdModal from '../Components/PwdModal'
import PwdModalActions from '../Redux/PwdModalRedux'


class ImportWalletScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mnemonic: 'taxi reward file cattle canoe orbit uniform civil tourist sun donkey need',

      keystore: '{"address":"fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","id":"d64a43b1-06de-468d-bc06-e6b39d515428","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"cdb19e71fcf868c842bf6c2a4006e0bb"},"ciphertext":"05cfe364bfb847ec9f27fd99f7dc4e30a4d58a2560ede52aef70d5c149b4635c","kdf":"scrypt","kdfparams":{"salt":"c9197a9b3ef9447e2c9b178cb8c0e9932ba7822002f08a06d85ecb8fc0c6c903","n":4096,"dklen":32,"p":1,"r":8},"mac":"a500e9ffd2b49794633dc5e846d6ef9856aea30de2095599b1db526cb964f028"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-10-01T09-31-29.0Z--fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","mnemonicCounter":"7fec53a97319ebff9a671eeef9e25c3b","mnemonicCiphertext":"8f88352567bbb001cb64936f84d5721b","version":"0.1"}}',
      password1: '',
      password2: '',
      keystore_password: '',

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
          placeholder='输入助记词'
          style={{
            marginTop: 20,
            fontSize: 16,
            height: 50,
            border: 2,
            color: Colors.text
          }}
          value={this.state.mnemonic}
          onChangeText={(mnemonic) => this.setState({mnemonic})} />
        <TextInput placeholder='密码'
          placeholderTextColor={Colors.cloud}
        style={{
          border: 2,
        }}
        value={this.state.password1}
        onChangeText={val => this.setState({password1: val})}


        />
        <TextInput placeholder='重复密码'
          placeholderTextColor={Colors.cloud}
        style={{
          border: 2,
        }}
        value={this.state.password2}
        onChangeText={val => this.setState({password2: val})}
        />
        <TouchableOpacity full dark style={{marginTop: 20}} onPress={() => {
          // this.props.openNewPwdModal()
          if(!!this.state.password1 && this.state.password1 == this.state.password2){
            var mnemonic = this.state.mnemonic
            var password = this.state.password2
            this.props.importFromMnemonic(mnemonic, this.state.password2)
          }else{
            alert('different password')
          }
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
          }}>----------------------------------------------------------------</Text>




        <Text style={{
          marginTop: 20,
          fontSize: 16,
          color: Colors.text
        }}>keystore</Text>
        <TextInput
          multiline
          numberOfLines={5}
          placeholder='keystore文本内容'
          placeholderTextColor={Colors.cloud}
          style={{
            marginTop: 20,
            fontSize: 16,
            height: 150,
            border: 2,
            borderColor: Colors.steel,
            color: Colors.text
          }}
          value={this.state.keystore}
          onChangeText={(keystore) => this.setState({keystore})} />
          <TextInput
          placeholder='Keystore密码'
          placeholderTextColor={Colors.cloud}
          style={{
            fontSize: 16,
            border: 2,
            color: Colors.text
          }}
        value={this.state.keystore_password}
        onChangeText={val => this.setState({keystore_password: val})}
          />
        <TouchableOpacity full dark style={{marginTop: 20}} onPress={() => {
          // this.props.openPwdModal()

          var keystore = this.state.keystore
          var password = this.state.keystore_password
          if(!!password){
            this.props.importEncryptWallet(JSON.parse(keystore), password)
          }else{
            alert('empty password')
          }
        }}>
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            color: Colors.text
          }}>keystore导入</Text>
        </TouchableOpacity>
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
    importFromMnemonic: (mnemonic, password) => dispatch(WalletActions.importFromMnemonic({mnemonic, password})),
    importEncryptWallet: (keystore, password) => dispatch(WalletActions.importEncryptWallet({keystore, password})),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    openNewPwdModal: () => dispatch(NewPwdModalActions.openNewPwdModal()),
    openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportWalletScreen)
