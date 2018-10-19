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

import WalletActions from '../Redux/WalletRedux'
import { displayETH, DECIMAL } from '../Lib/Utils/format'

const GAME_COMS = {2:<Coin />, 6:<OneDice />, 36:<TwoDice />, 100:<Etheroll />}
const GAME_TITLES = {2: 'Coin Flip', 6: 'Roll a Dice', 36: 'Two Dices', 100: 'Etheroll'}

class GameContainerScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return{
      title: navigation.getParam('title'),
      headerRight: (
        <TouchableOpacity style={{padding: 10}} onPress={navigation.getParam('gotoRecords')}>
          <Text style={{color:Colors.text}}> Global Records > </Text>
        </TouchableOpacity>
      )
    }
  }

  _placeBet = ()=>{
    let { index, stake, contract_address, address, betMask, openConfirmModal, navigate, getRandom, balance } = this.props

    if(!W.address) {
      navigate('WalletManageScreen')
    } else if (stake >= balance) {
      alert('You don\'t have enough balance to place Bet')
    } else {

      getRandom({address: W.address})

      // callback actions
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
  }

  render () {
    let { index, stake, balance, status, result, rewardTime, winRate, balanceFetching,
      setStake,
    } = this.props
    return (
      <ScrollView style={styles.container}>
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
              <TouchableOpacity style={styles.stakeButton} onPress={() => setStake(10000)}>
                <Text style={styles.stakeButtonText}>Max</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.stakeBox}>
              <TouchableOpacity style={styles.stakeButton} onPress={_=>setStake(stake - 0.01)}>
                <Text style={[styles.stakeButtonText, {fontSize: 28}]}>-</Text>
              </TouchableOpacity>
              <TextInput value={''+stake} style={styles.stakeInput}
                underlineColorAndroid={'transparent'}
                keyboardType='decimal-pad'
                onBlur={_=>setStake(parseFloat(stake.toFixed(2)))}
                onChangeText={(val) =>{ setStake(parseFloat(val)); this.forceUpdate() } }/>
              <TouchableOpacity style={styles.stakeButton} onPress={_=>setStake(stake + 0.01)}>
                <Text style={[styles.stakeButtonText, {fontSize: 28}]}>+</Text>
              </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
            <Text style={[styles.darkLabel, {alignSelf:'center', margin: 10}]}>Balance:  <Text style={styles.balanceText}>{balanceFetching?'updating..':displayETH(balance)}</Text>  ETH</Text>
            <View style={styles.rewardWrapper}>
              <View style={styles.infoWrapper}>
                <View style={styles.info}>
                  <Text style={styles.rewardText}>winning pays</Text>
                  <Text style={styles.keyText}>{(this.props.rewardTime).toFixed(2)}x</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.rewardText}>winning chance</Text>
                  <Text style={styles.keyText}>{(winRate * 100).toFixed(2)}%</Text>
                </View>
              </View>
              <Text style={styles.rewardText}>you will win  <Text style={styles.keyText}>{(rewardTime * stake).toFixed(DECIMAL)}</Text>  ETH</Text>
              <Text style={[styles.darkLabel, {fontSize: 11}]}>1% fee, 5% of winnings to your inviter</Text>
            </View>
            <View style={styles.startButtonWrapper}>
              <TouchableOpacity style={styles.startButton} onPress={this._placeBet}>
                <Text style={styles.startButtonText}> Bet! </Text>
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
    bet: { winRate, rewardTime, betMask, },
    config: {contract_address},
    wallet: { fetching, balance, address, gasPrice, secret }
  } = state
  return {
    index:key, stake, status, result,
    modalIsOpen, loading, gas,
    winRate, rewardTime, betMask,
    contract_address,
    balanceFetching:fetching, balance, address, gasPrice, secret
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
