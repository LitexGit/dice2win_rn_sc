import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { connect } from 'react-redux'

import ListEmptyComponent from '../Components/ListEmptyComponent'
import StatusBar from '../Components/StatusBar'

import NavigationActions from 'react-navigation/src/NavigationActions'
import ChannelConfirmModalActions from '../Redux/ChannelConfirmModalRedux'
import ChannelWithdrawModalActions from '../Redux/ChannelWithdrawModalRedux'

import ChannelActions from '../Redux/ChannelRedux'

import MessageBoxActions from '../Redux/MessageBoxRedux'

import { displayETH, DECIMAL } from '../Lib/Utils/format'

import I18n from '../I18n'

// Styles
import styles from './Styles/ChannelScreenStyle'

class ChannelScreen extends Component {

  static navigationOptions = {
    title: I18n.t('AccountTabTitle'),
    tabBarLabel: I18n.t('AccountTabLabel'),
    tabBarIcon: ({tintColor}) => (
      <FA5 name={'user'} size={Metrics.bottomTabIconSize} color={tintColor}/>
    )
  }

  constructor(props) {
    super(props)
  }

  componentDidMount (){
    this._refresh();
  }

  _refresh=()=>{
    const type='payments'
    this.props.getPayments(type, {page:1})
  }

  _loadMore=()=>{
  }

  _recharge = () => {
    let { openChannelConfirmModal, navigate, channel } = this.props

    if(!W.address) {
      navigate('WalletManageScreen')
    } /*else if (balance <= 0) {
      alert(I18n.t('InsufficientBalance'))
    }*/ else {
      // callback action
      let channelConfirmedActions = [{
        action: ChannelActions.openChannel,
        data: {}
      }]

      if(channel.status == 2) {
        // callback action
        channelConfirmedActions = [{
          action: ChannelActions.deposit,
          data: {}
        }]
      }

      openChannelConfirmModal({
        channelConfirmedActions
      })
    }
  }

  _withdraw = () => {
    let { openChannelWithdrawModal, navigate, channel } = this.props

    if(!W.address) {
      navigate('WalletManageScreen')
    } /*else if (balance <= 0) {
      alert(I18n.t('InsufficientBalance'))
    }*/ else {
      if(channel.status == 2) {
        // callback action
        let withdrawConfirmedActions = [{
          action: ChannelActions.closeChannel,
          data: {}
        }]

        openChannelWithdrawModal({
          withdrawConfirmedActions
        })
      } else {
        alert('通道已关闭, 无法提现');
      }
    }
  }

  _renderItem = ({item}) => {

    /**
     * winner    是否获胜 1 获胜 0亏损
     * createdAt 创建时间
     * negativeB 庄家地址
     * winAmount 赚取金额
     * */
    let { winner = 0, createdAt,  negativeB, winAmount} = item
    let { modulo } = this.props
    return <TouchableOpacity style={styles.gameItem} onPress={_=>this._itemPressed(item)}>
      <View style={styles.timeWrapper}>
        <Text style={[styles.statusText, GAME_STATUS[status].style]}>{GAME_STATUS[status].text}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      <View style={styles.userWrapper}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.userText}>{user}</Text>
      </View>

      <Bet modulo={modulo} bet={bet} />

      <View style={styles.inWrapper}>
        <Text style={styles.darkLabel}>in: </Text>
        <Text style={styles.inValue}>{displayETH(inValue, 2)}</Text>
      </View>

      <View style={styles.resultWrapper}>
        <Result modulo={modulo} result={result} />
      </View>

      <View style={styles.outWrapper}>
        <Text style={styles.darkLabel}>out: </Text>
        <Text style={styles.outValue}>{displayETH(outValue, 2)}</Text>
      </View>
    </TouchableOpacity>
  }

  render () {
    let { channel, records} = this.props

    return (
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.channelInfo}>
          <Text style={[styles.myBalance]}>{I18n.t('ChannelMyBalance')}: {displayETH(channel.localBalance)} ETH</Text>
          <Text style={[styles.rivalBalance]}>{I18n.t('ChannelRivalBalance')}: {displayETH(channel.remoteBalance)} ETH</Text>
        </View>

        <View style={styles.statusInfo}>
          <Text style={channel.status == 2 ? styles.channelStatusActive : styles.channelStatusClosed}>{channel.status == 2 ? I18n.t('ChannelActive') : I18n.t('ChannelClosed')}</Text>
        </View>

        <View style={styles.buttonInfo}>
          <TouchableOpacity style={styles.rechargeButton} onPress={() => this._recharge()}>
            <Text style={styles.buttonText}>{I18n.t('ChannelRecharge')}</Text>
          </TouchableOpacity>

          {channel.status == 2 && <TouchableOpacity style={styles.depositButton} onPress={() => this._withdraw()}>
            <Text style={styles.buttonText}>{I18n.t('ChannelWithdrawal')}</Text>
          </TouchableOpacity>}
        </View>

        <View>
          <FlatList style={styles.channelTradingList}
            data={this.props.records}
            renderItem={this._renderItem}
            ListEmptyComponent={ListEmptyComponent} />
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    channel: { channel,  records},
  } = state
  return {
    channel,records
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    openChannelConfirmModal: (data) => dispatch(ChannelConfirmModalActions.openChannelConfirmModal(data)),
    openChannelWithdrawModal: (data) => dispatch(ChannelWithdrawModalActions.openChannelWithdrawModal(data)),
    alert: (message) => dispatch(MessageBoxActions.openMessageBox({ title: 'Warning', message })),
    getPayments: (type, data) => dispatch(ChannelActions.getPayments({type, data})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelScreen)
