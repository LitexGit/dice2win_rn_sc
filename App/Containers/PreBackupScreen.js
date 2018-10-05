import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PreBackupScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'

class PreBackupScreen extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }



  render() {

    let { mnemonic } = this.props
    return (
      <ScrollView style={styles.container}>
        <Text style={{
          marginTop: 20,
          fontSize: 16,
          color: Colors.text,
        }}>请记录您的钱包的助记词并保存到安全的地方</Text>
        <Text style={{
          marginTop: 20,
          fontSize: 16,
          color: Colors.text,
        }}>钱包助记词用于恢复您的账户。任何时候都不要泄露您的助记词，建议不要使用截屏保存或通过互联网工具传输</Text>
        <Text style={{
          marginTop: 20,
          fontSize: 16,
          color: Colors.text,
        }}>{mnemonic}</Text>
        <TouchableOpacity style={{ marginTop: 20 }}
          onPress={() => this.props.navigate('BackupScreen')}>
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            color: Colors.text,
          }}>下一步</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return { mnemonic: W.wallet.mnemonic }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({ routeName: target })),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreBackupScreen)
