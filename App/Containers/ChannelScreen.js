import React, { Component } from 'react'
import { View, Text, TouchableOpacity, SectionList, RefreshControl} from 'react-native'
import { connect } from 'react-redux'

import ListEmptyComponent from '../Components/ListEmptyComponent'
import ListFooterComponent from '../Components/ListFooterComponent'
import StatusBar from '../Components/StatusBar'

import NavigationActions from 'react-navigation/src/NavigationActions'
import ChannelConfirmModalActions from '../Redux/ChannelConfirmModalRedux'
import ChannelWithdrawModalActions from '../Redux/ChannelWithdrawModalRedux'

import ChannelActions from '../Redux/ChannelRedux'

import MessageBoxActions from '../Redux/MessageBoxRedux'

import { displayETH, DECIMAL, sectionlize} from '../Lib/Utils/format'

import I18n from '../I18n'

// Styles
import styles from './Styles/ChannelScreenStyle'
import { Colors, Images, Metrics } from '../Themes'

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
    this.state = {
      type: 'payments',
      game: { page: 1 },
    }
  }

  componentDidMount (){
    this._refresh();
  }

  _refresh=()=>{
    let {type} = this.state
    this.setState({[type]:{page:1}})
    this.props.getPayments(type, {page:1})
  }

  _loadMore=()=>{
    if (this.props.loading) return;

    const {type} = this.state;
    let {page} = this.state[type];
    page = page + 1
    this.setState({[type]:{page}})
    console.tron.log(`loading page ${page} of ${type}`)
    this.props.getPayments(type, {page})
  }

  _recharge = () => {
    let { openChannelConfirmModal, navigate, channel} = this.props

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

  _itemPressed=(item)=>{

  }

  _renderItem = ({item}) => {

    /**
     * winner    是否获胜 1 获胜 0亏损
     * createdAt 创建时间
     * negativeB 庄家地址
     * winAmount 赚取金额
     * */
    let { winner = 0, time,  fromAddr, value} = item;

    let { modulo } = this.props
    return <TouchableOpacity style={styles.gameItem} onPress={_=>this._itemPressed(item)}>
       <View style={styles.item}>
         <View style={styles.leftSection}>
           <Text style={styles.winnerText}>{winner == 1 ? '赢了' : '亏了' }</Text>
           <Text numberOfLines={1} ellipsizeMode='tail' style={styles.timeText}>{time}</Text>
         </View>
         <View style={styles.centerSection}>
           <Text style={styles.fromText}>{winner == 1 ? 'from: ' : 'to: '}</Text>
           <Text numberOfLines={1} ellipsizeMode='middle' style={styles.fromAddrText}>{fromAddr}</Text>
         </View>
         <View style={styles.rightSection}>
           <Text style={styles.timeText}>{winner == 1 ? '+' : '-'}</Text>
           <Text numberOfLines={1} ellipsizeMode='tail' style={styles.valueText}>{displayETH(value)}</Text>
         </View>
       </View>
    </TouchableOpacity>
  }

  _renderSectionHeader = ({section}) => {
    return <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.key}</Text></View>
  }

  render () {
    let { channel, payments, refreshing, loading} = this.props

    console.log('===============payments=====================');
    console.log(payments);
    console.log('===============payments=====================');

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
        <SectionList style={styles.channelTradingList}
              refreshControl={<RefreshControl
              refreshing={refreshing}
              onRefresh={this._refresh}
              tintColor={Colors.tintColor}
              title={I18n.t('Refreshing')+".."}
              titleColor={Colors.text}/>}
            sections={payments}
            extraData={this.props}
            renderSectionHeader={this._renderSectionHeader}
            renderItem={this._renderItem}
            ListEmptyComponent = {ListEmptyComponent}
            ListFooterComponent={payments && payments.length && <ListFooterComponent
              loading={loading}
              onPress={this._loadMore}/>}
             />
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    channel: { channel,  payments, refreshing, loading}
  } = state
  return {
    channel,
    payments:sectionlize(payments),
    refreshing,
    loading
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


