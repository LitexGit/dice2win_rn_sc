import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import styles from './Styles/NewPwdModalStyle'
import NewPwdModalActions from '../Redux/NewPwdModalRedux'
import WalletActions from '../Redux/WalletRedux'
import connect from 'react-redux/es/connect/connect'
import NavigationActions from 'react-navigation/src/NavigationActions'

class NewPwdInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pwd1: '12',
      pwd2: '12'
    }
  }

  _checkPwd () {
    console.tron.log('this.state', this.state)
    if (this.state.pwd1 == this.state.pwd2) {
      this.props.setPwd(this.state.pwd2)
    } else {
      alert('密码不一致！')
    }
  }


  render () {
    return (
      <View style={{marginTop: 22}}>
            <TextInput style={styles.headerText}
                       autoFocus={false}
                       multiline={false}
                       placeholder='Input your password'
                       placeholderTextColor={'gray'}
                       underlineColorAndroid={'transparent'}
                       secureTextEntry={true}
                       value={this.state.pwd1}
                       onChangeText={val => this.setState({pwd1: val})}/>
            <TextInput style={styles.headerText}
                       autoFocus={false}
                       multiline={false}
                       placeholder='Input your password'
                       placeholderTextColor={'gray'}
                       underlineColorAndroid={'transparent'}
                       secureTextEntry={true}
                       value={this.state.pwd2}
                       onChangeText={val => this.setState({pwd2: val})}/>
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
    newWallet: (data) => dispatch(WalletActions.newWallet(data)),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPwdInput)
