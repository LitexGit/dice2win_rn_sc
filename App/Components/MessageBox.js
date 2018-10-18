import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import Overlay from 'react-native-modal-overlay'
import styles from './Styles/MessageBoxStyle'

import MessageBoxActions from '../Redux/MessageBoxRedux'
import NavigationActions from 'react-navigation/src/NavigationActions'
import connect from 'react-redux/es/connect/connect'


class MessageBox extends Component {


  _ok() {
    let {closeMessageBox, dispatch, submitedActions } = this.props
    // TODO check password validation
    closeMessageBox()
    submitedActions && submitedActions.forEach(a => dispatch(a))



  }

  _close () {
    let {dispatch, closeMessageBox, canceledActions} = this.props

    canceledActions && canceledActions.forEach(a => dispatch(a))
    closeMessageBox()
  }


  render () {

    let { title, message, type='info', isOpen, displayCancel } = this.props

    return (
      <Overlay
        containerStyle={styles.modal}
        childrenWrapperStyle={styles.content}
        visible={isOpen}
        animationType='zoomIn'
        animationDuration={300}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{title}</Text>
        </View>

        <View style={styles.statusWrapper}>
          <Text style={styles[type+'Text']}>{message}</Text>
        </View>
        <View style={styles.actionWrapper}>
          {!!displayCancel &&
            <TouchableOpacity style={styles.cancelButton} onPress={this._close.bind(this)}>
              <Text style={styles.label}> Cancel </Text>
            </TouchableOpacity>}
          <TouchableOpacity style={styles.confirmButton} onPress={this._ok.bind(this)}>
            <Text style={styles.label}> OK </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    submitedActions: state.messageBox.submitedActions,
    canceledActions: state.messageBox.canceledActions,
    isOpen: state.messageBox.isOpen,
    displayCancel: state.messageBox.displayCancel,
    title: state.messageBox.title,
    message: state.messageBox.message,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeMessageBox: () => dispatch(MessageBoxActions.closeMessageBox()),
    dispatch: ({action, data}) => dispatch(action(data)),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox)
