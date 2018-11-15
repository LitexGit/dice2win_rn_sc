import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/StatusBarStyle'

import { connect } from 'react-redux'
import NavigationActions from 'react-navigation/src/NavigationActions'
import ChannelActions from '../Redux/ChannelRedux'

import I18n from '../I18n'

class StatusBar extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.loadChannel()
  }

  render () {
    let { channel, channelIdentifier } = this.props
    console.tron.log('aaa', channel, channelIdentifier)

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={_ => this.props.navigate('ChannelScreen')}>
          <Text style={styles.channelStatus}>{I18n.t('ChannelStatus')}: {I18n.t('ChannelClosed')}, {I18n.t('ChannelDesc')}.</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    channel: { channel, channelIdentifier }
  } = state

  return {
    channel, channelIdentifier
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    loadChannel: () => dispatch(ChannelActions.channelRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar)
