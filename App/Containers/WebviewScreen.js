import React, { Component } from 'react'
import { View, Text, KeyboardAvoidingView, WebView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/WebviewScreenStyle'

class WebviewScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('title', '')
    }
  }

  render () {
    console.tron.log('WEBVIEW URL: ', this.props.url)
    return (
      <View style={styles.container}>
        <WebView style={styles.webview} source={{uri:this.props.url}} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let {routes, index} = state.nav
  return {
    url: routes[index].params && routes[index].params.url,
    title: routes[index].params && routes[index].params.title,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WebviewScreen)
