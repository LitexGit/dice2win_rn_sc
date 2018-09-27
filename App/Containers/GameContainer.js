import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, Modal, TextInput, Image, Slider } from 'react-native'
import { connect } from 'react-redux'

import GameActions from '../Redux/GameRedux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/GameContainerStyle'

import { Images, Colors } from '../Themes'
import Coin from '../Components/Coin'
import OneDice from '../Components/OneDice'
import TwoDice from '../Components/TowDice'
import Etheroll from '../Components/Etheroll'
import StakeModal from '../Components/StakeModal'
import StakeModalActions from '../Redux/StakeModalRedux'

class GameContainer extends Component {

  renderDice = index => {
    switch (index) {
      case 0:
        return (<Coin/>)
      case 1:
        return (<OneDice/>)
      case 2:
        return (<TwoDice/>)
      case 3:
        return (<Etheroll/>)
    }
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.gameContainer}>
          <View style={styles.gameConetent}>

            {this.renderDice(this.props.index)}
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
              <TouchableOpacity style={styles.startButton} onPress={this.props.openStakeModal}>
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
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    index: state.game.key,
    stake: state.game.stake,
    reward: state.game.reward,
    modalIsOpen: state.game.modalIsOpen,
    loading: state.game.loading,
    walletData: state.wallet.walletData,

    winRate: state.bet.winRate,
    rewardTime: state.bet.rewardTime,

    balance: state.wallet.payload.balance,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initGame: () => dispatch(GameActions.initGame()),
    request: () => dispatch(GameActions.gameRequest()),

    setStake: (stake) => dispatch(GameActions.setStake(stake)),
    addUnit: () => dispatch(GameActions.addUnit()),
    rmUnit: () => dispatch(GameActions.rmUnit()),
    openStakeModal: () => dispatch(StakeModalActions.openStakeModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer)
