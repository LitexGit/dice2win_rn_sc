import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import styles from './Styles/PwdModalStyle'
import PwdModalActions from '../Redux/PwdModalRedux'
import WalletActions from '../Redux/WalletRedux'
import connect from 'react-redux/es/connect/connect'
import NavigationActions from 'react-navigation/src/NavigationActions'

class PwdModal extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }
  state = {
    pwd: ''
  }

  _checkPwd () {

    this.props.setPwd(this.state.pwd)
    // this.props.unlockWallet();

    if(this.props.onSubmit){
      this.props.onSubmit(this.state.pwd)
    }
    this.props.closePwdModal()
  }


  _closeModal(){
    if(this.props.onCancel){
      this.props.onCancel()
    }
    this.props.resetUnlock()
    this.props.closePwdModal()
  }

  render () {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.modalIsOpen || !this.props.unlockSuccess}
          onRequestClose={() => {
            alert('Modal has been closed.')
          }}
        >
          <View style={{marginTop: 50, flex: 1}}>
            <TextInput multiline={false} placeholder='请输入密码' onChangeText={val => this.setState({pwd: val})}/>
          </View>

          <View style={{marginTop: 22, flex: 3}}>

            <TouchableOpacity full dark style={{marginTop: 20}} onPress={this._checkPwd.bind(this)}>
              <Text> 确 定 </Text>
            </TouchableOpacity>
            <TouchableOpacity full dark style={{marginTop: 20}} onPress={this._closeModal.bind(this)}>
              <Text> 取 消 </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modalIsOpen: state.pwdModal.modalIsOpen,
    keystore: state.wallet.keystore,
    unlockSuccess: state.wallet.unlockSuccess

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),
    setPwd: (password) => dispatch(PwdModalActions.setPwd(password)),
    importEncryptWallet: (data) => dispatch(WalletActions.importEncryptWallet(data)),
    unlockWallet: (password) => dispatch(WalletActions.unlockWallet({password})),
    resetUnlock: () => dispatch(WalletActions.setUnlock({unlockSuccess: true})),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    closePwdModal: () => dispatch(PwdModalActions.closePwdModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PwdModal)
