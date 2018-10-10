import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Button, Slider } from 'react-native'
import ConfirmModalActions from '../Redux/ConfirmModalRedux'

import connect from 'react-redux/es/connect/connect'
import Overlay from 'react-native-modal-overlay'
import styles from './Styles/ConfirmModalStyle'

class ConfirmModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      displayGas: props.gas,
      minGas: 4,
      maxGas: 100,
    }
  }

  _autoGas() {
    let {gasAuto, updateGas} = this.props
    updateGas(gasAuto)
    this.setState({displayGas: gasAuto})
  }

  render () {
    let { modalIsOpen, amount, from, to, gasAuto,
      updateGas,
    } = this.props
    let { displayGas, minGas, maxGas, } = this.state

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
          <Text style={styles.ethText}><Text style={{fontWeight:'900'}}>{amount}</Text> ETH</Text>
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
            <View style={styles.hContainer}>
              <Text style={styles.label}>Gas: </Text>
              <Text style={styles.gasText}><Text style={{fontWeight:'900'}}>{displayGas}</Text> Gwei</Text>
            </View>
            <View style={styles.hContainer}>
              <Text style={styles.autoGasText}>Recommend: </Text>
              <Text style={styles.autoGasText}>{gasAuto} </Text>
            </View>
            <TouchableOpacity style={styles.autoGasButton} onPress={this._autoGas.bind(this)}><Text style={styles.label}> Apply </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sliderWrapper}>
            <Text style={styles.label}>  {minGas} </Text>
            <Slider style={styles.slider} 
              step={1}
              value={displayGas}
              minimumValue={minGas}
              maximumValue={maxGas}
              onSlidingComplete={val => updateGas(val)}
              onValueChange={(val) => {
                this.setState({displayGas: val})
              }
            }/>
            <Text style={styles.label}> {maxGas}</Text>
          </View>
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
  return { modalIsOpen, amount, from, to, gas, gasAuto, fetching, confirmedActions, canceledActions } = state.confirmModal
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
