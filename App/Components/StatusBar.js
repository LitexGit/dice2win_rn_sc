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
    console.log('aaaaaaaaaaa', W.address)
    if(!dbInitializing && scclient == null) {
      this.props.loadChannel(true)
    } else {
      this.props.loadChannel(false)
    }
  }

  render () {
    let { channel } = this.props

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={_ => this.props.navigate('ChannelScreen')}>
          <Text style={channel.status == 2 ? styles.channelStatusActive : channel.status == 0 ? styles.channelStatusPending : styles.channelStatusClosed}>{I18n.t('ChannelStatus')}: {channel.status == 2 ? I18n.t('ChannelActive') : channel.status == 0 ? I18n.t('ChannelPending') : I18n.t('ChannelClosed')}, {channel.status == 2 ? I18n.t('ChannelActiveDesc') : I18n.t('ChannelDesc')}.</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    channel: { channel }
  } = state

  return {
    channel
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    loadChannel: (doInit) => dispatch(ChannelActions.channelRequest({doInit}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar)
