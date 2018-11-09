import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/StatusBarStyle'

import { connect } from 'react-redux'
import NavigationActions from 'react-navigation/src/NavigationActions'

class StatusBar extends Component {
  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={_ => this.props.navigate('ChannelScreen')}>
          <Text style={styles.channelStatus}>通道状态: Closed, 无法进行游戏</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar)
