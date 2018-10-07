import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Modal } from 'react-native'
import ConfirmModalActions from '../Redux/ConfirmModalRedux'

import connect from 'react-redux/es/connect/connect'
import Overlay from 'react-native-modal-overlay'
import styles from './Styles/ConfirmModalStyle'

class ConfirmModal extends Component {
  render () {
    let { modalIsOpen, amount, from, to, gas } = this.props
    return (
      <Overlay 
        containerStyle={styles.modal}
        childrenWrapperStyle={styles.content}
        visible={modalIsOpen}
        animationType='zoomIn'
        animationDuration={300}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Confirm</Text>
        </View>
        <View style={styles.ethWrapper}>
          <Text style={styles.ethText}>{amount} ETH</Text>
        </View>
        <View style={styles.fromToWrapper}>
          <Text style={styles.label}>From: </Text>
          <Text style={styles.fromToText}>{from}</Text>
        </View>
        <View style={styles.fromToWrapper}>
          <Text style={styles.label}>To: </Text>
          <Text style={styles.fromToText}>{to}</Text>
        </View>
        <View style={styles.gasWrapper}>
          <Text style={styles.label}>Gas: </Text>
          {/* TODO need to be passed in */}
          <Text style={styles.gasText}>{gas} GWei</Text>
        </View>

        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.cancelButton} onPress={this._cancel.bind(this)}>
            <Text style={styles.label}> Cancel </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={this._confirm.bind(this)}>
            <Text style={styles.label}> Confirm </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    )
  }

  _confirm = () => {
    let { closeConfirmModal, dispatch, confirmedActions } = this.props
    confirmedActions && confirmedActions.forEach(a => dispatch(a));
    closeConfirmModal()
  }

  _cancel = () => {
    let { closeConfirmModal, dispatch, canceledActions } = this.props
    canceledActions  && canceledActions.forEach(a => dispatch(a));
    closeConfirmModal()
  }
}

const mapStateToProps = (state) => {
  return { modalIsOpen, amount, from, to, gas, fetching, confirmedActions, canceledActions } = state.confirmModal
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeConfirmModal: () => dispatch(ConfirmModalActions.closeConfirmModal()),
    dispatch: ({action, data}) => dispatch(action(data)), 
    onCancel: (canceledActions) => {
      canceledActions.map(({action, data}) => dispatch(action(data)))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal)
