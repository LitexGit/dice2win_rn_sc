import React, { Component } from 'react'
import { ScrollView, Text, View, Button, TouchableOpacity, TextInput, Image} from 'react-native'
import { connect } from 'react-redux'

import NavigationActions from 'react-navigation/src/NavigationActions'
import GameActions from '../Redux/GameRedux'
import StakeModalActions from '../Redux/StakeModalRedux'
import PwdModalActions from '../Redux/PwdModalRedux'

import { Colors, Images } from '../Themes'

import Coin from '../Components/Coin'
import OneDice from '../Components/OneDice'
import TwoDice from '../Components/TwoDice'
import Etheroll from '../Components/Etheroll'

import StakeModal from '../Components/StakeModal'
import ResultModal from '../Components/ResultModal'
import PwdModal from '../Components/PwdModal'

import styles from './Styles/GameContainerScreenStyle'

const GAME_COMS = [<Coin />, <OneDice />, <TwoDice />, <Etheroll />]
const GAME_TAGS = ['coin', 'dice1', 'dice2', 'roll']

const Bet = ({game, bet}) => <View style={styles.betContentWrapper}>
  { game === 'coin' && <Image style={styles.betIcon} source={bet?Images.coinPosLight:Images.coinNegLight} />}
  { game === 'dice1' && <Text style={styles.betText}>{bet}</Text> }
  { game === 'dice2' && <Text style={styles.betText}>{bet.map(b=>b+',')}</Text> }
  { game === 'roll' && <Text style={styles.betText}>{'≤' + bet}</Text>}
</View>

const Result = ({game, result}) => <View style={styles.betContentWrapper}>
  { game === 'coin' && <Image style={styles.resultIcon} source={result?Images.coinPosLight:Images.coinNegLight} /> }
  { game === 'dice1' && <Text style={styles.resultText}>{result}</Text> }
  { game === 'dice2' && <Text style={styles.resultText}>{result.map(r=>r+',')}</Text> }
  { game === 'roll' && <Text style={styles.resultText}>{result}</Text> }
</View>


import WalletActions from '../Redux/WalletRedux'

class GameContainerScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return{
      headerRight: (
        <Button
          onPress={navigation.getParam('gotoRecords')}
          title="Records"
          color="#fff"
        />
      )
    }
  }


  _placeBet = ()=>{
    if(!W.wallet){
      this.props.openPwdModal()
    }else{
      this._placeBetWithPassword('')
    }
  }

  _placeBetWithPassword = (password) => {
    this.props.getRandom({ address: W.address, value: this.props.stake, betMask: this.props.betMask, modulo: this.props.modulo, password: password})
    this.props.updateStatus('place')
  }

  componentDidMount(){
    this.props.navigation.setParams({ gotoRecords: _=>this.props.navigate('GameRecordScreen')})
    this.props.loadWallet()
    this.props.updateStatus()
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.GameContainerScreen}>
          <View style={styles.gameConetent}>

            {GAME_COMS[this.props.index]}

            <View style={styles.stakeBox}>
              <TouchableOpacity style={styles.stakeButton} onPress={() => this.props.setStake('0.05')}>
                <Text style={styles.stakeButtonText}>0.05</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton} onPress={() => this.props.setStake('0.10')}>
                <Text style={styles.stakeButtonText}>0.10</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton} onPress={() => this.props.setStake('0.15')}>
                <Text style={styles.stakeButtonText}>0.15</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton}>
                <Text style={styles.stakeButtonText}>Max</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.stakeBox} >
              <TouchableOpacity style={styles.stakeButton} onPress={this.props.rmUnit}>
                <Text style={[styles.stakeButtonText, {fontSize: 28}]}>-</Text>
              </TouchableOpacity>
              <TextInput value={this.props.stake} style={styles.stakeInput}
                         onChangeText={(val) => this.props.setStake(val)}/>
              <TouchableOpacity style={styles.stakeButton} onPress={this.props.addUnit}>
                <Text style={[styles.stakeButtonText, {fontSize: 28}]}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.balanceWrapper}>
              <Text style={styles.balanceText}>your balance: </Text>
              <Text style={[styles.balanceText, {color: Colors.casinoGreen}]}>{this.props.balance}</Text>
            </View>
            <View style={styles.startButtonWrapper}>
              {/* <TouchableOpacity style={styles.startButton} onPress={() => this.props.openStakeModal({ */}
              <TouchableOpacity style={styles.startButton} onPress={() => this._placeBet()}>
                <Text style={styles.startButtonText}> Start </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rewardWrapper}>
              <Text style={styles.rewardText}>winning pays <Text style={styles.keyText}>{(this.props.rewardTime).toFixed(2)}x</Text>️, winning chance: <Text style={styles.keyText}>{(this.props.winRate * 100).toFixed(2)}%</Text></Text>
              <Text style={styles.label}>1% fee, 5% of reward to inviter</Text>
              <Text style={styles.rewardText}>you will win <Text style={styles.keyText}>{(this.props.rewardTime * this.props.stake).toFixed(5)}ETH</Text></Text>
            </View>
          </View>
          <StakeModal />
          <ResultModal />
          <PwdModal onSubmit={(password)=>this._placeBetWithPassword(password)}/>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    betMask: state.bet.betMask,
    modulo: state.bet.modulo,

    index: state.game.key,
    stake: state.game.stake,
    reward: state.game.reward,
    modalIsOpen: state.game.modalIsOpen,
    loading: state.game.loading,

    winRate: state.bet.winRate,
    rewardTime: state.bet.rewardTime,

    balance: state.wallet.balance,
    records: state.record.global.records,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    initGame: () => dispatch(GameActions.initGame()),
    request: () => dispatch(GameActions.gameRequest()),

    setStake: (stake) => dispatch(GameActions.setStake(stake)),
    addUnit: () => dispatch(GameActions.addUnit()),
    rmUnit: () => dispatch(GameActions.rmUnit()),

    openStakeModal: () => dispatch(StakeModalActions.openStakeModal()),
    openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),

    updateStatus: (status) => dispatch(GameActions.updateStatus(status)),

    sendStake: () => dispatch(WalletActions.sendStake()),
    loadWallet: () => dispatch(WalletActions.walletRequest()),
    getRandom: (address) => dispatch(WalletActions.getRandom(address)),

    navigate: (target) => dispatch(NavigationActions.navigate({routeName:target}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainerScreen)
