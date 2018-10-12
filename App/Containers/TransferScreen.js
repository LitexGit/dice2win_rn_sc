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
import { Colors } from '../Themes'

class TransferScreen extends Component {

  static navigationOptions = {
    title: 'Transfer'
  }

  state = {
    to: '', //'0x253917c6befa4251a26c9fd248275238eeabb663',
    value: '0.01'
  }

  _transfer () {
    let {openConfirmModal, address, balance} = this.props

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
              data: {...{to, value} = this.state}
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

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>
            Wallet balance: {this.props.balance.toFixed(9)} ETH
          </Text>
        </View>
        <View style={styles.header}>
          <TextInput style={styles.headerText}
                     autoFocus={false}
                     multiline={false}
                     placeholder='please input receiver eth address'
                     placeholderTextColor={'gray'}
                     clearButtonMode='always'
                     value={this.state.to}
                     onChangeText={(to) => this.setState({to})}/>
        </View>
        <View style={styles.header}>
          <TextInput style={styles.valueText}
                     autoFocus={false}
                     multiline={false}
                     placeholder='please input send eth amount'
                     placeholderTextColor={'gray'}
                     clearButtonMode='always'
                     keyboard='numeric'
                     value={this.state.value.toString()}
                     onChangeText={(value) => this.setState({value})}/>
          <Text style={styles.ETH}>ETH</Text>
        </View>
        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.confirmButton}
                            onPress={this._transfer.bind(this)}>
            <Text style={styles.label}> Transfer </Text>
          </TouchableOpacity>
        </View>
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
