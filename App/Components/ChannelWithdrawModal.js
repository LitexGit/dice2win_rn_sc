import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/ConfirmModalStyle'

import ChannelWithdrawModalActions from '../Redux/ChannelWithdrawModalRedux'

import connect from 'react-redux/es/connect/connect'
import Overlay from 'react-native-modal-overlay'

import I18n from '../I18n'

class ChannelWithdrawModal extends Component {
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
          <Text style={styles.label}>提现金额之后，通道会自动关闭，您确定要这样做吗</Text>
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
    let { closeChannelWithdrawModal, dispatch, withdrawConfirmedActions } = this.props
    withdrawConfirmedActions && withdrawConfirmedActions.forEach(a => dispatch(a));
    closeChannelWithdrawModal()
  }

  _cancel = () => {
    let { closeChannelWithdrawModal, dispatch, withdrawCanceledActions } = this.props
    withdrawCanceledActions  && withdrawCanceledActions.forEach(a => dispatch(a));
    closeChannelWithdrawModal()
  }
}

const mapStateToProps = (state) => {
  let {
    channelWithdrawModal: { modalIsOpen, withdrawConfirmedActions, withdrawCanceledActions }
  } = state

  return { modalIsOpen, withdrawConfirmedActions, withdrawCanceledActions }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeChannelWithdrawModal: () => dispatch(ChannelWithdrawModalActions.closeChannelWithdrawModal()),
    dispatch: ({action, data}) => dispatch(action(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelWithdrawModal)
