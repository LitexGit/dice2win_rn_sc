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
    if(!dbInitializing && scclient == null) {
      this.props.loadChannel(true)
    } else {
      this.props.loadChannel(false)
    }
  }

  _getChannelstyles=(status)=>{
    switch (status) {
      case 0:
        return styles.channelStatusPending;
      case 2:
        return styles.channelStatusActive;
      case 6:
        return styles.channelStatusClosed;
      default:
        return styles.channelStatusClosed;
    }

  }

  _getChannelStatusDescribe=(status)=>{
    switch (status) {
      case 0:
        return I18n.t('ChannelPending');
      case 2:
        return I18n.t('ChannelActive');
      case 6:
        return I18n.t('ChannelClosed');
      default:
        return I18n.t('ChannelClosed');
    }
 }

 _getChannelDescribe=(status)=>{
  switch (status) {
    case 2:
      return I18n.t('ChannelActiveDesc');
    default:
      return I18n.t('ChannelDesc');
  }
}


  render () {
    const { channel, web3Status, socketStatus} = this.props;
    const connetcStyle = web3Status && socketStatus ? {} : {backgroundColor: 'red'};
    const connectDes =  web3Status && socketStatus ? '' : '服务器连接异常-';

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={_ => this.props.navigate('ChannelScreen')}>
          <Text style={[this._getChannelstyles(channel.status), connetcStyle]}>{connectDes}{I18n.t('ChannelStatus')}: {this._getChannelStatusDescribe(channel.status)}, {this._getChannelDescribe(channel.status)}.</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    channel: { channel, web3Status, socketStatus}
  } = state

  console.log('=================socketStatus===================');
  console.log(web3Status);
  console.log(socketStatus);
  console.log('==================socketStatus==================');
  return { channel, web3Status, socketStatus}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    loadChannel: (doInit) => dispatch(ChannelActions.channelRequest({doInit}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar)

