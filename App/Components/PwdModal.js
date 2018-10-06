import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import Overlay from 'react-native-modal-overlay'
import styles from './Styles/PwdModalStyle'
import PwdModalActions from '../Redux/PwdModalRedux'
import WalletActions from '../Redux/WalletRedux'
import connect from 'react-redux/es/connect/connect'
import NavigationActions from 'react-navigation/src/NavigationActions'
import { Colors } from '../Themes';

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
      <Overlay 
        containerStyle={styles.modal}
        childrenWrapperStyle={styles.content}
        visible={this.props.modalIsOpen}
        animationType='zoomIn'
        animationDuration={300}>
        <View style={styles.header}>
          <TextInput style={styles.headerText} 
            multiline={false}
            placeholder='Input your password'
            placeholderTextColor={'gray'}
            secureTextEntry={true}
            onChangeText={val => this.setState({pwd: val})}/>
        </View>

        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.cancelButton} onPress={this._closeModal.bind(this)}>
            <Text style={styles.label}> 取 消 </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={this._checkPwd.bind(this)}>
            <Text style={styles.label}> 确 定 </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modalIsOpen: state.pwdModal.modalIsOpen,
    keystore: state.wallet.keystore,
    unlockSuccess: state.pwdModal.unlockSuccess

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),
    setPwd: (password) => dispatch(PwdModalActions.setPwd(password)),
    importEncryptWallet: (data) => dispatch(WalletActions.importEncryptWallet(data)),
    unlockWallet: (password) => dispatch(WalletActions.unlockWallet({password})),
    resetUnlock: () => dispatch(PwdModalActions.setUnlock({unlockSuccess: false})),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    closePwdModal: () => dispatch(PwdModalActions.closePwdModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PwdModal)
