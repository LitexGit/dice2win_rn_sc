import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import GameActions from '../Redux/GameRedux'
import WalletActions from '../Redux/WalletRedux'
import { displayETH } from '../Lib/Utils/format'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import styles from './Styles/ResultModalStyle'
import { connect } from 'react-redux'
import I18n from '../I18n';

import winOrLose from '../Utils/Eth4FunUtils'

// i18n
const STATUS_TEXT = {
  placing: I18n.t('placing'),
  placed: I18n.t('placed'),
  drawn: I18n.t('drawn'),
  win: I18n.t('winMsg'),
  lose: I18n.t('loseMsg'),
  fail: I18n.t('failMsg'),
  won: 'Winning confirmed',
  lost: 'Lost confirmed',
}

const GAME_ENDED = (status) => {
  return ['win', 'lose', 'fail', 'won', 'lost'].includes(status)
}

class ResultModal extends Component {

  render () {
    const {modulo={}, status={}, result={}} = this.props||{}
    console.log('===============this.props=====================');
    console.log(result);
    console.log(result.betDetail);
    console.log('===============this.props=====================');

    const {betMask=0, ra='', rb=''} = result.betDetail||{};
    const formula = 'Hash(A,B)mod2=';

    const isWin = winOrLose(betMask, modulo, ra, rb);

    const winDes = isWin ? 'WIN：玩家P' : '庄家B';

    return (
      <View style={styles.detailSection}>
        <View style={[styles.container, styles['container_'+status]]}>
          <View style={styles.content}>
            <Text style={styles.statusText}>{STATUS_TEXT[status]}</Text>
            {status==='win' && result.amount && <Text style={styles.amountText}>{displayETH(result.amount)} ETH!</Text>}
          </View>
          <View style={styles.buttonPanel}>
            {GAME_ENDED(status) && <TouchableOpacity style={styles.buttonWrapper} onPress={_=>this.props.close(modulo, status)}>
              <Text style={styles.buttonText}>{I18n.t('Close')}</Text>
            </TouchableOpacity>}
            {!GAME_ENDED(status) && <TouchableOpacity style={styles.buttonWrapper} onPress={_=>this.props.refresh(modulo, status)}>
              <Icon name={'refresh'} style={styles.refreshIcon} />
              <Text style={styles.buttonText}>{I18n.t('Refresh')}</Text>
            </TouchableOpacity>}
        </View>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.titleText}>链下开奖过程</Text>
          <View style={styles.paramSection}>
            <View style={[styles.playerSection, {marginRight: 10}]}>
                <Text style={[styles.titleText, {fontSize: 20}]}>玩家P</Text>
                <Text  numberOfLines={1} ellipsizeMode='tail' style={styles.desText}>Bet(P):{betMask}</Text>
                <Text  numberOfLines={1} ellipsizeMode='tail' style={styles.desText}>Random(P):{ra}</Text>
            </View>
            <View style={[styles.playerSection, {marginRight: 10,}]}>
                <Text style={[styles.titleText, {fontSize: 20}]}>庄家B</Text>
                <Text  numberOfLines={1} ellipsizeMode='tail' style={styles.desText}>Bet(B):{betMask == 0 ? 1 : 0}</Text>
                <Text  numberOfLines={1} ellipsizeMode='tail' style={styles.desText}>Random(b):{rb}</Text>
            </View>
          </View>

          <View style={styles.resultSection}>
            <Text style={[styles.desText, {marginTop: 25}]}>{formula}{isWin ? betMask : betMask == 0 ? 1 : 0 }</Text>
            <Text style={[styles.titleText, {marginTop: 10}]}>{winDes}</Text>
          </View>

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
    close: (modulo, status)=>{
      dispatch(GameActions.updateStatus({status:{[modulo]:'idle'}}))
      dispatch(WalletActions.walletRequest())
    },
    refresh: () => dispatch(GameActions.refreshStatus())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultModal)
