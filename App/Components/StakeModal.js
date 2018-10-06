import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Modal } from 'react-native'
import StakeModalActions from '../Redux/StakeModalRedux'
import WalletActions from '../Redux/WalletRedux'
import GameActions from '../Redux/GameRedux'

import connect from 'react-redux/es/connect/connect'

import Overlay from 'react-native-modal-overlay'

import styles from './Styles/StakeModalStyle'

class StakeModal extends Component {
  render () {
    return (
      <Overlay 
        containerStyle={styles.modal}
        childrenWrapperStyle={styles.content}
        visible={this.props.modalIsOpen}
        animationType='zoomIn'
        animationDuration={300}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Confirm</Text>
          </View>
          <View style={styles.ethWrapper}>
            <Text style={styles.ethText}>{this.props.stake} ETH</Text>
          </View>
          <View style={styles.fromToWrapper}>
            <Text style={styles.label}>From: </Text>
            <Text style={styles.fromToText}>{this.props.address}</Text>
          </View>
          <View style={styles.fromToWrapper}>
            <Text style={styles.label}>To: </Text>
            <Text style={styles.fromToText}>{this.props.contract}</Text>
          </View>
          <View style={styles.gasWrapper}>
            <Text style={styles.label}>Gas</Text>
            <Text style={styles.gasText}>6G Wei</Text>
          </View>

          <View style={styles.actionWrapper}>
            <TouchableOpacity style={styles.cancelButton} onPress={this.props.closeStakeModal}>
              <Text style={styles.label}> Cancel </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={_=>this._confirm()}>
              <Text style={styles.label}> Confirm </Text>
            </TouchableOpacity>
          </View>
      </Overlay>
    )
  }

  _confirm = () => {
    let {getRandom, updateStatus, closeStakeModal, 
      address, stake, betMask, modulo, password} = this.props

    getRandom({ address, value: stake, betMask, modulo, password })
    
    if(password && password!='')  {
      updateStatus({[modulo]:'place'})
    }

    closeStakeModal()
  }
}

const mapStateToProps = (state) => {
  return {
    modalIsOpen: state.stakeModal.modalIsOpen,
    stake: state.game.stake,
    contract: state.config.contract_address,
    address: state.wallet.address, // Need to be state.user.address ?
    betMask: state.bet.betMask,
    modulo: state.bet.modulo,
    password: state.pwdModal.pwd,
    loading: state.stakeModal.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openStakeModal: () => dispatch(StakeModalActions.openStakeModal()),
    closeStakeModal: () => dispatch(StakeModalActions.closeStakeModal()),
    updateStatus: (status) => dispatch(GameActions.updateStatus(status)),
    getRandom: (address) => dispatch(WalletActions.getRandom(address)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StakeModal)
