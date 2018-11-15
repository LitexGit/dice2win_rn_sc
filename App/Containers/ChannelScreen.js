import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { connect } from 'react-redux'

import ListEmptyComponent from '../Components/ListEmptyComponent'
import StatusBar from '../Components/StatusBar'

import NavigationActions from 'react-navigation/src/NavigationActions'
import ChannelConfirmModalActions from '../Redux/ChannelConfirmModalRedux'
import WalletActions from '../Redux/WalletRedux'

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

  _recharge = () => {
    let { openChannelConfirmModal, navigate, balance, address } = this.props
    
    if(!W.address) {
      navigate('WalletManageScreen')
    } else if (balance <= 0) {
      alert(I18n.t('InsufficientBalance'))
    } else {
      // callback action 
      let confirmedActions = [{
        action: WalletActions.placeBet,
        data: { address }
      }]

      openChannelConfirmModal({
        confirmedActions
      })
    }
  }

  _renderItem = ({item}) => {
    let { amount:inValue, address_from:user, dice_payment:outValue, time, bet_res:status, bet_mask:bet, bet_detail:result} = item
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
    return (
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.channelInfo}>
          <Text style={[styles.myBalance]}>{I18n.t('ChannelMyBalance')}: --ETH</Text>
          <Text style={[styles.rivalBalance]}>{I18n.t('ChannelRivalBalance')}: --ETH</Text>
        </View>

        <View style={styles.statusInfo}>
          <Text style={[styles.channelStatus]}>{I18n.t('ChannelClosed')}</Text>
        </View>

        <View style={styles.buttonInfo}>
          <TouchableOpacity style={styles.rechargeButton} onPress={() => this._recharge()}>
            <Text style={styles.buttonText}>{I18n.t('ChannelRecharge')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.depositButton} onPress={() => this._recharge()}>
            <Text style={styles.buttonText}>{I18n.t('ChannelWithdrawal')}</Text>
          </TouchableOpacity>
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
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
    openChannelConfirmModal: (data) => dispatch(ChannelConfirmModalActions.openChannelConfirmModal(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelScreen)
