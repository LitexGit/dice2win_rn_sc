import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import ChannelConfirmModalActions from '../Redux/ChannelConfirmModalRedux'

import connect from 'react-redux/es/connect/connect'
import Overlay from 'react-native-modal-overlay'
import styles from './Styles/ConfirmModalStyle'
// import { displayETH } from '../Lib/Utils/format'
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import I18n from '../I18n';
// import {isNumber, getEffectiveNum} from '../Utils/Eth4FunUtils';

class ChannelConfirmModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      channelAmount: '',
    }
  }

  _onChangeText=(text)=>{
    this.setState({channelAmount: text});
  }

  render () {
    let { modalIsOpen, loading, amount} = this.props;
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
          <Text style={styles.label}>Amount: </Text>
          <TextInput style={styles.inputText}
            value = {1}
            autoFocus={true}
            multiline={false}
            textAlign='center'
            placeholder="请输入金额"
            placeholderTextColor={'gray'}
            underlineColorAndroid={'transparent'}
            keyboardType='numeric'
            onChangeText={this._onChangeText}/>
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
    let { closeChannelConfirmModal, dispatch, channelConfirmedActions, setChannelAmount } = this.props;
    setChannelAmount(this.state.channelAmount)
    channelConfirmedActions && channelConfirmedActions.forEach(a => dispatch(a));
    closeChannelConfirmModal();
    this.setState({
      channelAmount:''
    })
  }

  _cancel = () => {
    let { closeChannelConfirmModal, dispatch, channelCanceledActions } = this.props
    channelCanceledActions  && channelCanceledActions.forEach(a => dispatch(a));
    closeChannelConfirmModal()
  }
}

const mapStateToProps = (state) => {
  let {
    channelConfirmModal: { modalIsOpen, channelAmount, channelConfirmedActions, channelCanceledActions, amount},
  } = state

  return { modalIsOpen, channelAmount, channelConfirmedActions, channelCanceledActions, amount}
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeChannelConfirmModal: () => dispatch(ChannelConfirmModalActions.closeChannelConfirmModal()),
    setChannelAmount: (amount) => dispatch(ChannelConfirmModalActions.setChannelAmount(amount)),
    dispatch: ({action, data}) => dispatch(action(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelConfirmModal)
