import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import WalletActions from '../Redux/WalletRedux'

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
    this.props.newWallet()
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Text style={{ marginTop: 20, fontSize: 16,
          color: Colors.text}}>NewWallet Container</Text> <TouchableOpacity onPress={_ => this.props.navigate('PreBackupScreen')}>
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            color: Colors.text}}> 备份钱包 </Text>
        </TouchableOpacity>
        <NewPwdModal />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    newWallet: () => dispatch(WalletActions.newWallet()),
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewWalletScreen)
