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
import { Colors, Images, Metrics, Fonts} from '../Themes';

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
      page: 1,
    }
  }

  componentDidMount (){
    this._refresh();
    this.props.syncChannel();
  }

  _refresh=()=>{
    if (!W.address) return;
    let {type} = this.state
    this.setState({
      page:1
    })
    this.props.getPayments(type, {page:1})
  }

  _loadMore=()=>{
    if (!W.address) return;
    // if (this.props.loading) return;
    const {type} = this.state;
    let {page} = this.state;
    page = page + 1

    this.setState({
      page
    })


    console.tron.log(`loading page ${page} of ${type}`)
    this.props.getPayments(type, {page})
  }

  _recharge = () => {
    let { openChannelConfirmModal, navigate, channel, unlockWallet, balance } = this.props
    if(!W.address) {
      navigate('WalletManageScreen')
    } else if (balance <= 0) {
      alert(I18n.t('InsufficientBalance'))
    } else {
      if(!!W.wallet) {
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
      } else {
        unlockWallet()
      }
    }
  }

  _withdraw = () => {
    let { openChannelWithdrawModal, navigate, channel, unlockWallet } = this.props

    if(!W.address) {
      navigate('WalletManageScreen')
    } /*else if (balance <= 0) {
      alert(I18n.t('InsufficientBalance'))
    }*/ else {
      if(!!W.wallet) {
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
      } else {
        unlockWallet()
      }
    }
  }

  _itemPressed=(item)=>{

  }

  /*
  betId: 106
  createdAt: "2018-11-15 05:55:19.068 +00:00"
  date: "2018-11-15"
  fromAddr: "0x633177eeE5dB5a2c504e0AE6044d20a9287909f9"
  paymentId: 106
  time: "13:55:19"
  toAddr: "0x56d77fcb5e4Fd52193805EbaDeF7a9D75325bdC0"
  updatedAt: "2018-11-15 05:55:19.068 +00:00"
  value: "19200000000000000"
  */
  _renderItem = ({item}) => {

    /**
     * winner    是否获胜 1 获胜 0亏损
     * createdAt 创建时间
     * negativeB 庄家地址
     * winAmount 赚取金额
     * */
    let { winner = 0, time,  fromAddr, value, toAddr} = item;
    if(!W.address) {
      navigate('WalletManageScreen')
    } else {
      winner = W.address == toAddr ? 1 : 0;
    }

    return <TouchableOpacity style={styles.gameItem} onPress={_=>this._itemPressed(item)}>
       <View style={styles.item}>
         <View style={styles.leftSection}>
           <Text style={styles.winnerText}>{winner == 1 ? '赢了' : '输了' }</Text>
           <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.timeText, {marginTop: 5}]}>{time}</Text>
         </View>
         <View style={styles.centerSection}>
           <Text style={styles.fromText}>{winner == 1 ? 'from: ' : 'to: '}</Text>
           <Text numberOfLines={1} ellipsizeMode='middle' style={styles.fromAddrText}>{fromAddr}</Text>
         </View>
         <View style={styles.rightSection}>
           <Text style={styles.timeText}>{winner == 1 ? '+ ' : '- '}</Text>
           <Text numberOfLines={1} ellipsizeMode='tail' style={styles.valueText}>{displayETH(value)}</Text>
         </View>
       </View>
    </TouchableOpacity>
  }

  _renderSectionHeader = ({section}) => {
    return <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.key}</Text></View>
  }

  render () {
    const { channel, payments, refreshing, loading} = this.props;
    const isTopUp = displayETH(channel.remoteBalance) > 1 ? false : true;

    return (
      <View style={styles.container}>
        { W.address && <StatusBar /> }
        <View style={styles.channelInfo}>
          <Text style={[styles.myBalance]}>{I18n.t('ChannelMyBalance')}: {displayETH(channel.localBalance)} ETH</Text>
          <View style={styles.rivalSection}>
            <Text style={styles.rivalBalance}>{I18n.t('ChannelRivalBalance')}: {displayETH(channel.remoteBalance)} ETH</Text>
            {isTopUp ? <Text style={[styles.rivalBalance, {fontSize: Fonts.size.small}]}>正在充值中</Text> : null}
          </View>
        </View>

        <View style={styles.statusInfo}>
          <Text style={channel.status == 2 ? styles.channelStatusActive : channel.status == 0 ? styles.channelStatusPending : styles.channelStatusClosed}>{
            channel.status == 2 ? I18n.t('ChannelActive') : channel.status == 0 ?  I18n.t('ChannelPending') : I18n.t('ChannelClosed')
          }</Text>
        </View>

        <View style={styles.buttonInfo}>
          <TouchableOpacity style={styles.rechargeButton} disabled={channel.status == 0 ? true : false} onPress={() => this._recharge()}>
            <Text style={styles.buttonText}>{channel.status == 2 ? I18n.t('ChannelRecharge') : I18n.t('ChannelOpen')}</Text>
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
    channel: { channel,  payments, refreshing, loading},
    wallet: { balance, address }
  } = state

  return {
    channel,
    payments:sectionlize(payments),
    refreshing,
    loading,
    balance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    openChannelConfirmModal: (data) => dispatch(ChannelConfirmModalActions.openChannelConfirmModal(data)),
    openChannelWithdrawModal: (data) => dispatch(ChannelWithdrawModalActions.openChannelWithdrawModal(data)),
    alert: (message) => dispatch(MessageBoxActions.openMessageBox({ title: 'Warning', message })),
    unlockWallet: () => dispatch(ChannelActions.openChannel()),
    syncChannel: () => dispatch(ChannelActions.syncChannel()),
    getPayments: (type, data) => dispatch(ChannelActions.getPayments({type, data})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelScreen)


