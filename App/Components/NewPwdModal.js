import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import styles from './Styles/NewPwdModalStyle'
import NewPwdModalActions from '../Redux/NewPwdModalRedux'
import WalletActions from '../Redux/WalletRedux'
import connect from 'react-redux/es/connect/connect'
import NavigationActions from 'react-navigation/src/NavigationActions'

class NewPwdModal extends Component {
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
    pwd1: '',
    pwd2: ''
  }

  _checkPwd () {
    if (this.state.pwd1 === this.state.pwd2) {

      // this.props.encryptWallet({this.props.wallet ,this.state.pwd2})
      this.props.encryptWallet({wallet: this.props.wallet, pwd: this.state.pwd2})
      // if (this.props.navigateName) {
      //   this.props.navigate(this.props.navigateName)
      // }
      this.props.closeNewPwdModal()
    } else {
      alert('密码不一致！')
    }
  }

  render () {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.modalIsOpen}
          onRequestClose={() => {
            alert('Modal has been closed.')
          }}
        >
          <View style={{marginTop: 50, flex: 1}}>
            <TextInput multiline={false} placeholder='请设置密码' onChangeText={val => this.setState({pwd1: val})}/>
            <TextInput multiline={false} placeholder='再次输入确认' onChangeText={val => this.setState({pwd2: val})}/>
          </View>

          <View style={{marginTop: 22, flex: 3}}>

            <TouchableOpacity full dark style={{marginTop: 20}} onPress={this._checkPwd.bind(this)}>
              <Text> 确 定 </Text>
            </TouchableOpacity>
            <TouchableOpacity full dark style={{marginTop: 20}} onPress={this.props.closeNewPwdModal}>
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
    modalIsOpen: state.newPwdModal.modalIsOpen,
    wallet: state.wallet.wallet
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openNewPwdModal: () => dispatch(NewPwdModalActions.openNewPwdModal()),
    setPwd: (pwd) => dispatch(NewPwdModalActions.setPwd(pwd)),
    encryptWallet: (data) => dispatch(WalletActions.encryptWallet(data)),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    closeNewPwdModal: () => dispatch(NewPwdModalActions.closeNewPwdModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPwdModal)
