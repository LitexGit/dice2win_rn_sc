import React, { Component } from 'react'
import { ScrollView, Text, View, Button, TouchableOpacity, TextInput, Image} from 'react-native'
import { connect } from 'react-redux'

import NavigationActions from 'react-navigation/src/NavigationActions'
import GameActions from '../Redux/GameRedux'
import ConfirmModalActions from '../Redux/ConfirmModalRedux'
import PwdModalActions from '../Redux/PwdModalRedux'

import { Colors } from '../Themes'

import Coin from '../Components/Coin'
import OneDice from '../Components/OneDice'
import TwoDice from '../Components/TwoDice'
import Etheroll from '../Components/Etheroll'

import ConfirmModal from '../Components/ConfirmModal'
import ResultModal from '../Components/ResultModal'
import PwdModal from '../Components/PwdModal'

import styles from './Styles/GameContainerScreenStyle'

import WalletActions from '../Redux/WalletRedux'

const GAME_COMS = {2:<Coin />, 6:<OneDice />, 36:<TwoDice />, 100:<Etheroll />}
const GAME_TITLES = {2: 'Coin Flip', 6: 'Roll a Dice', 36: 'Two Dices', 100: 'Etheroll'}

class GameContainerScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return{
      title: navigation.getParam('title'),
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
    let gas = 6
    let {index, stake, contract_address, address, betMask, openConfirmModal} = this.props

    if(!W.address)
      this.props.navigate('WalletManageScreen')
    else 
      openConfirmModal({
        amount: stake,
        from: address,
        to: contract_address,
        gas,
        confirmedActions: [{action: WalletActions.getRandom, data: {address, value:stake, betMask, modulo:index, password:''}},
          {action: GameActions.updateStatus, data: {status: 'place'}}],
      })
  }
/*
  _placeBet = ()=>{
    if(!W.address){
      this.props.navigate('WalletManageScreen')

    }else if(!W.wallet){
      this.props.openPwdModal()
    }else{
      this._placeBetWithPassword('')
    }
  }

  _placeBetWithPassword = (password) => {
    this.props.openConfirmModal() // we can get password inside the modal
  }
*/

  componentDidMount(){
    this.props.navigation.setParams({ gotoRecords: _=>this.props.navigate('GameRecordScreen')})
    this.props.navigation.setParams({ title: GAME_TITLES[this.props.index]})
    this.props.loadWallet()
  }

  render () {
    let { index, status, result } = this.props
    return (
      <ScrollView style={styles.container}>
        <View style={styles.GameContainerScreen}>
          {status[index]!='idle' && (
            <ResultModal modulo={index} status={status[index]} result={result[index]} />
          )}

          {status[index] === 'idle' && <View style={styles.gameConetent}>

            {GAME_COMS[index]}

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
            <Text style={styles.balanceText}>balance: <Text>{this.props.balance} ETH</Text></Text>
            <View style={styles.rewardWrapper}>
              <View style={styles.infoWrapper}>
                <View style={styles.info}>
                  <Text style={styles.rewardText}>winning pays</Text>
                  <Text style={styles.keyText}>{(this.props.rewardTime).toFixed(2)}x</Text>️
                </View>
                <View style={styles.info}>
                  <Text style={styles.rewardText}>winning chance:</Text>
                  <Text style={styles.keyText}>{(this.props.winRate * 100).toFixed(2)}%</Text>
                </View>
              </View>
              <Text style={styles.rewardText}>you will win <Text style={styles.keyText}>{(this.props.rewardTime * this.props.stake).toFixed(5)} ETH</Text></Text>
              <Text style={[styles.label, {fontSize: 11}]}>1% fee, 5% of bonus to your inviter</Text>
            </View>
            <View style={styles.startButtonWrapper}>
              <TouchableOpacity style={styles.startButton} onPress={() => this._placeBet()}>
                <Text style={styles.startButtonText}> Bet! </Text>
              </TouchableOpacity>
            </View>
          </View>}
          <ConfirmModal />
          <PwdModal />
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    game: {key, stake, status, result },
    confirmModal: { modalIsOpen, loading },
    bet: { winRate, rewardTime, betMask, },
    config: {contract_address},
    wallet: { balance, address }
  } = state

  return {
    index:key, stake, status, result,
    modalIsOpen, loading,
    winRate, rewardTime, betMask,
    contract_address,
    balance, address
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

    initGame: () => dispatch(GameActions.initGame()),
    request: () => dispatch(GameActions.gameRequest()),

    setStake: (stake) => dispatch(GameActions.setStake(stake)),
    addUnit: () => dispatch(GameActions.addUnit()),
    rmUnit: () => dispatch(GameActions.rmUnit()),

    openConfirmModal: (data) => dispatch(ConfirmModalActions.openConfirmModal(data)),
    openPwdModal: () => dispatch(PwdModalActions.openPwdModal()),

    updateStatus: (status) => dispatch(GameActions.updateStatus(status)),

    sendStake: () => dispatch(WalletActions.sendStake()),
    loadWallet: () => dispatch(WalletActions.walletRequest()),
    getRandom: (data) => dispatch(WalletActions.getRandom(data)),

    navigate: (target) => dispatch(NavigationActions.navigate({routeName:target}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainerScreen)
