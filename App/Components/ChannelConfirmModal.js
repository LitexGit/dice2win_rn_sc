import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import ChannelConfirmModalActions from '../Redux/ChannelConfirmModalRedux'

import connect from 'react-redux/es/connect/connect'
import Overlay from 'react-native-modal-overlay'
import styles from './Styles/ConfirmModalStyle'
// import { displayETH } from '../Lib/Utils/format'
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import I18n from '../I18n'

class ChannelConfirmModal extends Component {
  constructor(props){
    super(props)
  }

  render () {
    let { modalIsOpen, loading } = this.props

    return (
      <Overlay
        containerStyle={styles.modal}
        childrenWrapperStyle={styles.content}
        visible={modalIsOpen}
        onRequestClose={this._cancel.bind(this)}
        animationType='zoomIn'
        animationDuration={300}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{I18n.t('Confirm')}</Text>
        </View>
        
        <View style={styles.fromToWrapper}>
          <Text style={styles.label}>From: </Text>
          <TextInput style={{height:40}} underlineColorAndroid="transparent" placeholder="请输入金额" keyboardType='numeric'></TextInput>
        </View>

        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.cancelButton} onPress={this._cancel.bind(this)}>
            <Text style={styles.label}> {I18n.t('Cancel')} </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} disabled={loading} onPress={this._confirm.bind(this)}>
            <Text style={styles.label}> {loading?I18n.t('Loading')+'...':I18n.t('Confirm')} </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    )
  }

  _confirm = () => {
    let { closeChannelConfirmModal, dispatch, confirmedActions } = this.props
    confirmedActions && confirmedActions.forEach(a => dispatch(a));
    closeChannelConfirmModal()
  }

  _cancel = () => {
    let { closeChannelConfirmModal, dispatch, canceledActions } = this.props
    canceledActions  && canceledActions.forEach(a => dispatch(a));
    closeChannelConfirmModal()
  }
}

const mapStateToProps = (state) => {
  let {
    channelConfirmModal: { modalIsOpen, channelAmount, confirmedActions, canceledActions }
  } = state

  return { modalIsOpen, channelAmount, confirmedActions, canceledActions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeChannelConfirmModal: () => dispatch(ChannelConfirmModalActions.closeChannelConfirmModal()),
    dispatch: ({action, data}) => dispatch(action(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelConfirmModal)
