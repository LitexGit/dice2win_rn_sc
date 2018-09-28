import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList, Image} from 'react-native'
import Canvas from 'react-native-canvas'
import Blockies from 'ethereum-blockies'
import { connect } from 'react-redux'

import GameActions from '../Redux/GameRedux'
import StakeModalActions from '../Redux/StakeModalRedux'
import RecordActions from '../Redux/RecordRedux'


import { Colors, Images } from '../Themes'
import Coin from '../Components/Coin'
import OneDice from '../Components/OneDice'
import TwoDice from '../Components/TowDice'
import Etheroll from '../Components/Etheroll'

import StakeModal from '../Components/StakeModal'

import styles from './Styles/GameContainerStyle'

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
import AppConfig from '../Config/AppConfig'

class GameContainer extends Component {

  _renderAvatar = (canvas, {user}) => {
    // Blockies.render({ seed: user, size: 8, scale: 3, }, canvas)
    if(canvas != null) 
    {
      console.log('canvas: ', canvas)
      Blockies.render(canvas)
    }
  }

  _renderItem = ({item}) => {
    console.tron.log("Record Item", item)
    if(!item) 
      return null
    return <TouchableOpacity style={styles.recordItem} onPress={_ => this._itemPressed(item)}>
    <View style={styles.recordItemTop}>
      {/* <Canvas style={styles.recordAvatar} ref={canvas => this._renderAvatar(canvas, item)} /> */}
      <View style={styles.valueWrapper}>
        <Text style={styles.label}>in: </Text>
        <Text style={styles.inValue}>{item.inValue.toFixed(5)}</Text>
      </View>
      <View style={styles.valueWrapper}>
        <Text style={styles.label}>out: </Text>
        <Text style={styles.outValue}>{item.outValue.toFixed(5)}</Text>
      </View>
    </View>
    <View style={styles.recordItemBottom}>
      <View style={styles.userColWrapper}><Text numberOfLines={1} ellipsizeMode='middle' style={styles.userColText}>{item.user}</Text></View>
      <View style={styles.betColWrapper}><Bet game={item.game} bet={item.bet} /></View>
      <View style={styles.resultColWrapper}><Result game={item.game} result={item.result} /></View>
    </View>

    </TouchableOpacity>
  }

  componentDidMount(){
    this.props.loadRecords('global')
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.gameContainer}>
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
              <TouchableOpacity style={styles.startButton} onPress={() => this.props.getRandom({
                address: AppConfig.wallet.address,
                value: this.props.stake,
                betMask: this.props.betMask,
                modulo: this.props.modulo
              })}>
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
        </View>

        <FlatList 
          style={styles.recordList}
          data={this.props.records.filter(r=>r.game===GAME_TAGS[this.props.index])}
          renderItem={this._renderItem.bind(this)} />
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
    walletData: state.wallet.walletData,

    winRate: state.bet.winRate,
    rewardTime: state.bet.rewardTime,

    balance: state.wallet.payload.balance,
    records: state.record.payload.global.records,
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

    sendStake: () => dispatch(WalletActions.sendStake()),
    getRandom: (address) => dispatch(WalletActions.getRandom(address)),
    loadRecords: (type) => dispatch(RecordActions.recordRequest({type}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer)
