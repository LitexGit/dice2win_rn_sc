import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/TransferScreenStyle'
import WalletActions from '../Redux/WalletRedux'
import ConfirmModalActions from '../Redux/ConfirmModalRedux'
import PwdModalActions, { openPwdModal } from '../Redux/PwdModalRedux'
import { Colors } from '../Themes';

class TransferScreen extends Component {
  state = {
    to: '0xfc379f1fe62a88e047c50a36f8c1e4fa3e93092f',
    value: '0.001'
  }

  static navigationOptions = {
    title: 'Transfer'
  }



  _transfer() {
    let { openConfirmModal, address, balance } = this.props

    if (!W.address) {
      navigate('WalletManageScreen')
    } else if (this.state.value >= balance) {
      alert('You don\'t have enough balance to place Bet')
    } else {

      let confirmedActions = [{
        action: PwdModalActions.openPwdModal,
        data: {
          submitedActions: [
            {
              action: WalletActions.transfer,
              data: { ...{ to, value } = this.state }
            }
          ]
        }
      }]

      openConfirmModal({
        amount: this.state.value,
        from: address,
        to: this.state.to,
        confirmedActions
      })
    }

  }


  render() {
    return (
      <View style={styles.container}>

        <View style={{
          flex: 10,
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}>
          <Text style={{ padding: 10, alignSelf: 'center' }}>
            Current Balance: {this.props.balance} ETH
        </Text>
          <TextInput placeholder='Receiver ETH address'
            placeholderTextColor={Colors.cloud}
            style={{
              flex: 2,
              borderBottomWidth: 1,
              borderBottomColor: Colors.facebook,
            }}
            value={this.state.to} onChangeText={(to) => this.setState({ to })} />
          <TextInput placeholder='Transfer Amount'
            placeholderTextColor={Colors.cloud}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.facebook,
            }}
            value={this.state.value.toString()}
            onChangeText={(value) => this.setState({ value })} />

        </View>
        <TouchableOpacity style={styles.buttonWrapper}
          onPress={this._transfer.bind(this)} >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    balance: state.wallet.balance,
    // txHash: state.wallet.tx.hash,
    address: state.wallet.address
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    transfer: (data) => dispatch(WalletActions.transfer(data)),
    openPwdModal: (data) => dispatch(PwdModalActions.openPwdModal(data)),
    openConfirmModal: (data) => dispatch(ConfirmModalActions.openConfirmModal(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferScreen)
