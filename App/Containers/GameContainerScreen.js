import React, { Component } from 'react'
import { ScrollView, Text, View, Button, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native'
import { connect } from 'react-redux'

import NavigationActions from 'react-navigation/src/NavigationActions'
import GameActions from '../Redux/GameRedux'
import ConfirmModalActions from '../Redux/ConfirmModalRedux'
import PwdModalActions from '../Redux/PwdModalRedux'

import Coin from '../Components/Coin'
import OneDice from '../Components/OneDice'
import TwoDice from '../Components/TwoDice'
import Etheroll from '../Components/Etheroll'

import ResultModal from '../Components/ResultModal'

import { Colors } from '../Themes'
import styles from './Styles/GameContainerScreenStyle'
import Entypo from 'react-native-vector-icons/Entypo'

import WalletActions from '../Redux/WalletRedux'
import { displayETH, DECIMAL } from '../Lib/Utils/format'
import I18n from '../I18n'
import StatusBar from '../Components/StatusBar';

const GAME_COMS = {2:<Coin />, 6:<OneDice />, 36:<TwoDice />, 100:<Etheroll />}

const GAME_TITLES = {
  2: I18n.t('GameCoinTitle'),
  6: I18n.t('GameDice1Title'),
  36: I18n.t('GameDice2Title'),
  100: I18n.t('GameRollTitle')
}

class GameContainerScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return{
      title: navigation.getParam('title'),
      headerRight: (
        <TouchableOpacity style={{padding: 10, flexDirection:'row', alignItems:'center'}} onPress={navigation.getParam('gotoRecords')}>
          <Text style={{color:'lightsteelblue'}}>
            {I18n.t('GlobalRecords')}  
          </Text>
          <Entypo name={"chevron-thin-right"} size={20} color={Colors.cloud} />
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      stake: 0.1,
      valid: true,
    }
  }

  _placeBet = () => {
    let { index, stake, contract_address, address, betMask, openConfirmModal, navigate, getRandom, setStake, balance, uid } = this.props
    let {valid} = this.state
    if(!valid) {
      alert(I18n.t('InvalidStake'))
      return
    }

    tracker.trackEvent('BetButton', "Click", {
      label: `uid:${uid},modulo:${index},stake:${stake}`,
      value: uid
    })
    
    if(!W.address) {
      navigate('WalletManageScreen')
    } else if (stake >= balance) {
      alert(I18n.t('InsufficientBalance'))
    } else {

      getRandom({address: W.address})
      
      // callback action 
      let confirmedActions = [{
        action: WalletActions.placeBet,
        data: { address, value: stake, betMask, modulo: index, password: '' }
      }]

      openConfirmModal({
        amount: stake,
        from: address,
        to: contract_address,
        confirmedActions
      })
    }
  }

  componentDidMount(){
    this.props.navigation.setParams({ gotoRecords: _=>this.props.navigate('GameRecordScreen')})
    this.props.navigation.setParams({ title: GAME_TITLES[this.props.index]})
    this.props.setStake(this.props.stake)
    this.props.loadWallet()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.winRate != prevProps.winRate){
      this.props.setStake(this.props.stake)
    }
    if(this.props.stake != prevProps.stake) {
      this.setState({stake:this.props.stake})
    }
  }

  render () {
    let { index, stake, balance, status, result, rewardTime, winRate, feeRate, balanceFetching,
      setStake,
    } = this.props
    return (
      <ScrollView style={styles.container}>
        <StatusBar />
        <View style={styles.GameContainerScreen}>
          {status[index]!='idle' && (
            <ResultModal modulo={index} status={status[index]} result={result[index]} />
          )}

          {status[index] === 'idle' && <View style={styles.gameConetent}>
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={100} >
            {GAME_COMS[index]}
            <View style={styles.stakeBox}>
              <TouchableOpacity style={styles.stakeButton} onPress={() => setStake(0.05)}>
                <Text style={styles.stakeButtonText}>0.05</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton} onPress={() => setStake(0.10)}>
                <Text style={styles.stakeButtonText}>0.10</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton} onPress={() => setStake(0.15)}>
                <Text style={styles.stakeButtonText}>0.15</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton} onPress={() => setStake(10000.0)}>
                <Text style={styles.stakeButtonText}>Max</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.stakeBox}>
              <TouchableOpacity style={styles.stakeButton} onPress={_=>setStake(stake - 0.01)}>
                <Text style={[styles.stakeButtonText, {fontSize: 28}]}>-</Text>
              </TouchableOpacity>

              <TextInput value={''+this.state.stake} style={[styles.stakeInput, !this.state.valid && {borderBottomColor: 'red'}]}
                underlineColorAndroid={'transparent'}
                keyboardType='decimal-pad'
                numberOfLines={1}
                onChangeText={text => {
                  this.setState({stake:text})
                  if(/^\d+(\.\d{1,2})?$/.test(text)){
                    let stake = parseFloat(text)
                    if(!!stake){
                    this.setState({valid:true})
                      setStake(stake)
                    }
                  } else {
                    this.setState({valid:false})
                  }
                }}
                />

              <TouchableOpacity style={styles.stakeButton} onPress={_=>setStake(stake + 0.01)}>
                <Text style={[styles.stakeButtonText, {fontSize: 28}]}>+</Text>
              </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
            <Text style={[styles.darkLabel, {alignSelf:'center', margin: 10}]}>{I18n.t('Balance')}:  <Text style={styles.balanceText}>{balanceFetching?I18n.t('Updating'):displayETH(balance)}</Text>  ETH</Text> 
            <Text style={[styles.darkLabel, {alignSelf:'center', margin: 10}]}>{I18n.t('Balance')}:  <Text style={styles.balanceText}>{balanceFetching?I18n.t('Updating'):displayETH(balance)}</Text>  ETH</Text> 
            <View style={styles.rewardWrapper}>
              <View style={styles.infoWrapper}>
                <View style={styles.info}>
                  <Text style={styles.rewardText}>{I18n.t('WinningPays')}</Text>
                  <Text style={styles.keyText}>{(this.props.rewardTime).toFixed(2)}x</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.rewardText}>{I18n.t('WinningChance')}</Text>
                  <Text style={styles.keyText}>{(winRate * 100).toFixed(2)}%</Text>
                </View>
              </View>
              <Text style={styles.rewardText}>{I18n.t('YouWillWin')}  <Text style={styles.keyText}>{(rewardTime * stake).toFixed(DECIMAL)}</Text>  ETH</Text>
              <Text style={[styles.darkLabel, {fontSize: 11}]}>{feeRate*100}% {I18n.t('fee')}, 5% {I18n.t('OfWinningsToYourInviter')}</Text>
            </View>
            <View style={styles.startButtonWrapper}>
              <TouchableOpacity style={styles.startButton} onPress={this._placeBet}>
                <Text style={styles.startButtonText}> {I18n.t('Bet')}! </Text>
              </TouchableOpacity>
            </View>
          </View>}
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    game: {key, stake, status, result},
    confirmModal: { modalIsOpen, loading, gas },
    bet: { winRate, feeRate, rewardTime, betMask, },
    config: {contract_address},
    wallet: { fetching, balance, address, gasPrice, secret },
    user: {uid}
  } = state
  return {
    index:key, stake, status, result,
    modalIsOpen, loading, gas,
    winRate, feeRate, rewardTime, betMask,
    contract_address,
    balanceFetching:fetching, balance, address, gasPrice, secret,
    uid,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initGame: () => dispatch(GameActions.initGame()),
    request: () => dispatch(GameActions.gameRequest()),

    setStake: (stake) => dispatch(GameActions.setStake(stake)),

    openConfirmModal: (data) => dispatch(ConfirmModalActions.openConfirmModal(data)),
    openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),

    sendStake: () => dispatch(WalletActions.sendStake()),
    loadWallet: () => dispatch(WalletActions.walletRequest()),
    getRandom: (data) => dispatch(WalletActions.getRandom(data)),
    placeBet: (data) => dispatch(WalletActions.placeBet(data)),

    navigate: (target) => dispatch(NavigationActions.navigate({routeName:target}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainerScreen)
