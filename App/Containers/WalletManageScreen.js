import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/WalletManageScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'
import NewPwdModalActions from '../Redux/NewPwdModalRedux'

class WalletManageScreen extends Component {
  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={{marginTop: 22, flex: 3}}>

          <TouchableOpacity style={styles.buttonWrapper} onPress={_ => this.props.navigate('NewWalletScreen')}>
            <Text style={styles.buttonText}> New Wallet </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonWrapper} onPress={_ => this.props.navigate('ImportWalletScreen')}>
            <Text style={styles.buttonText}> Import Wallet </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_ => this.props.navigate('TransferScreen')}>
            <Text style={{
              marginTop: 20,
              fontSize: 16,
              color: Colors.text,
            }}> 转账 </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    openNewPwdModal: () => dispatch(NewPwdModalActions.openNewPwdModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletManageScreen)
