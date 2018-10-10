import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import Overlay from 'react-native-modal-overlay'
import styles from './Styles/PwdModalStyle'
import PwdModalActions from '../Redux/PwdModalRedux'
import NavigationActions from 'react-navigation/src/NavigationActions'
import connect from 'react-redux/es/connect/connect'

class PwdModal extends Component {

  state = {
    pwd: '',
    submitted: false,
  }

  _checkPwd () {
    let {setPwd, dispatch, submitedActions } = this.props
    // TODO check password validation
    setPwd(this.state.pwd)
    this.setState({submitted: true})
    submitedActions && submitedActions.forEach(a => dispatch(a));

    // closePwdModal()
  }


  _closeModal(){
    let { dispatch, closePwdModal, canceledActions } = this.props

    canceledActions  && canceledActions.forEach(a => dispatch(a));
    closePwdModal()
  }

  render () {

    let { errInfo, setErrInfo } = this.props
    return (
      <Overlay
        containerStyle={styles.modal}
        childrenWrapperStyle={styles.content}
        visible={this.props.modalIsOpen}
        animationType='zoomIn'
        animationDuration={300}>
        <View style={styles.header}>
          <TextInput style={styles.headerText}
            autoFocus={true}
            multiline={false}
            placeholder='Input your password'
            placeholderTextColor={'gray'}
            secureTextEntry={true}
            onChangeText={val => {
              this.setState({pwd: val, submitted: false})
              setErrInfo(null)
            }}/>
        </View>

        {this.state.submitted && <View style={styles.statusWrapper}>
          <Text style={!!errInfo?styles.errText:styles.label}> {!!errInfo?errInfo:'checking...'} </Text>}
        </View> }

        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.cancelButton} onPress={this._closeModal.bind(this)}>
            <Text style={styles.label}> Cancel </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} disabled={this.state.submitted} onPress={this._checkPwd.bind(this)}>
            <Text style={styles.label}> Submit </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    submitedActions: state.pwdModal.submitedActions,
    canceledActions: state.pwdModal.canceledActions,
    modalIsOpen: state.pwdModal.modalIsOpen,
    errInfo: state.pwdModal.errInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closePwdModal: () => dispatch(PwdModalActions.closePwdModal()),
    setPwd: (password) => dispatch(PwdModalActions.setPwd(password)),
    setErrInfo: (errInfo) => dispatch(PwdModalActions.setErrInfo({errInfo})),
    dispatch: ({action, data}) => dispatch(action(data)),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PwdModal)
