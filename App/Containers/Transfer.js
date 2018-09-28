import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/TransferStyle'
import WalletActions from '../Redux/WalletRedux'
import AppConfig from '../Config/AppConfig'

class Transfer extends Component {
  state = {
    to: '0x486c14c72bd37ead125c37d9d624118946d18a36',
    value: '0.0001'
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Text>Transfer Container</Text>

        <Text style={{color: '#000', alignSelf: 'center'}}>转账</Text>
        <View>
          <TextInput placeholder='请输入对方地址' value={this.state.to} onChangeText={(to) => this.setState({to})}/>
          <TextInput placeholder='请输入转账金额ETH' value={this.state.value.toString()}
                     onChangeText={(value) => this.setState({value})}/>
        </View>
        <TouchableOpacity full dark style={{marginTop: 20}}
                          onPress={() => this.props.transfer({to: this.state.to, value: this.state.value})}>
          <Text>转账</Text>
        </TouchableOpacity>
        <Text style={{padding: 10, fontSize: 11}}>
          {/*我的钱包地址:{this.props.address}*/}
        </Text>
        <Text style={{padding: 10, fontSize: 22, alignSelf: 'center'}}>
          {this.props.balance}
        </Text>
        <Text style={{padding: 10, fontSize: 11}}>
          {/*当前交易哈希: {this.props.txHash}*/}
        </Text>

      </ScrollView>
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
    transfer: (data) => dispatch(WalletActions.transfer(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transfer)
