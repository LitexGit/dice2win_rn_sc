import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import WalletActions from '../Redux/WalletRedux'
import NewPwdModalActions from '../Redux/NewPwdModalRedux'

// Styles
import styles from './Styles/NewWalletScreenStyle'
import NewPwdModal from '../Components/NewPwdModal'
import Colors from '../Themes/Colors'
import NavigationActions from 'react-navigation/src/NavigationActions'

// var ethers = require('../Lib/ethers')

class NewWalletScreen extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }
  componentDidMount () {
    console.tron.log('NewWalletScreen componentDidMount')
    this.props.openNewPwdModal()
    this.props.newWallet()
  }

  render () {

    let {mnemonic} = this.props

    console.tron.log('New Wallet props',this.props)

    return (
      <ScrollView style={styles.container}>
        <Text style={{ marginTop: 20, fontSize: 16,
          color: Colors.text}}>{mnemonic}</Text>
          <TouchableOpacity onPress={_ => this.props.navigate('BackupScreen')}>
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            color: Colors.text}}> 下一步</Text>
        </TouchableOpacity>
        <NewPwdModal onCancel={_ => this.props.back()} />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mnemonic: state.wallet.wallet.mnemonic
    // mnemonic: 'hello'
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    newWallet: () => dispatch(WalletActions.newWallet()),
    openNewPwdModal: () => dispatch(NewPwdModalActions.openNewPwdModal()),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    back: () => dispatch(NavigationActions.back()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewWalletScreen)
