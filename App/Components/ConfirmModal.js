import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Slider } from 'react-native'
import ConfirmModalActions from '../Redux/ConfirmModalRedux'

import connect from 'react-redux/es/connect/connect'
import Overlay from 'react-native-modal-overlay'
import styles from './Styles/ConfirmModalStyle'
import { displayETH } from '../Lib/Utils/format'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import I18n from '../I18n'

class ConfirmModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      displayGas: props.gas,
      minGas: 1,
      maxGas: 100,
    }
  }

  _autoGas() {
    let {gasAuto, updateGas} = this.props
    updateGas(gasAuto)
    this.setState({displayGas: gasAuto})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let {gasAuto, gas} = this.props
    if(!gas || gasAuto != prevProps.gasAuto){
      this._autoGas()
    }
  }

  render () {
    let { modalIsOpen, amount, from, to, gasAuto,
      updateGas, loading
    } = this.props
    let { displayGas, minGas, maxGas, } = this.state

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
        <View style={styles.ethWrapper}>
          <Text style={styles.ethText}><Text style={{fontWeight:'900'}}>{displayETH(amount)}</Text> ETH</Text>
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
          <View style={styles.gasStatus}>
            <View style={[styles.hContainer, {justifyContent:'flex-start'}]}>
              <Text style={styles.label}>Gas: </Text>
              <Text style={styles.gasText}><Text style={{fontWeight:'900'}}>{displayGas}</Text> Gwei</Text>
            </View>
            <View style={[styles.hContainer, {justifyContent:'flex-end'}]}>
              <Text style={styles.label}>{I18n.t('Recommend')}: </Text>
              <Text style={styles.autoGasText}>{gasAuto}  </Text>
            </View>
            <TouchableOpacity style={styles.autoGasButton} onPress={this._autoGas.bind(this)}><Text style={styles.label}> {I18n.t('Apply')} </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sliderWrapper}>
            <Text style={styles.label}>{minGas} </Text>
            <Slider style={styles.slider}
              step={1}
              value={displayGas}
              minimumValue={minGas}
              maximumValue={maxGas}
              onSlidingComplete={val => updateGas(val)}
              onValueChange={(val) => {
                this.setState({displayGas: val})
                ReactNativeHapticFeedback.trigger()
              }
            }/>
            <Text style={styles.label}> {maxGas}</Text>
          </View>
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
  let {
    confirmModal: { modalIsOpen, amount, from, to, gas, gasAuto,
      fetching, confirmedActions, canceledActions },
    wallet: {fetching: fetchingRandom, secret},
  } = state

  return { modalIsOpen, amount, from, to, gas, gasAuto,
    fetching, confirmedActions, canceledActions,
    loading: fetchingRandom || !secret,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeConfirmModal: () => dispatch(ConfirmModalActions.closeConfirmModal()),
    dispatch: ({action, data}) => dispatch(action(data)),
    updateGas: (gas) => dispatch(ConfirmModalActions.confirmModalSuccess({gas})),
    onCancel: (canceledActions) => {
      canceledActions.map(({action, data}) => dispatch(action(data)))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal)
