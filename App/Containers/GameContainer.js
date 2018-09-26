import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, Modal, TextInput, Image, Slider } from 'react-native'
import { connect } from 'react-redux'

import GameActions from '../Redux/GameRedux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/GameContainerStyle'

import { Images } from '../Themes'
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
                <Text>0.05</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton} onPress={() => this.props.setStake('0.10')}>
                <Text>0.10</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton} onPress={() => this.props.setStake('0.15')}>
                <Text>0.15</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stakeButton}>
                <Text>最大</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.stakeBox}
            >
              <TouchableOpacity style={styles.stakeButton} onPress={this.props.rmUnit}>
                <Text>-</Text>
              </TouchableOpacity>
              <TextInput value={this.props.stake} style={styles.stakeInput}
                         onChangeText={(val) => this.props.setStake(val)}/>
              <TouchableOpacity style={styles.stakeButton} onPress={this.props.addUnit}>
                <Text>+</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={this.props.openStakeModal}>
                <Text> 下 注 </Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.balanceText}>余额：0</Text>
            </View>
            <View>
              <Text
                style={styles.rewardText}>赢得投注{(this.props.rewardTime).toFixed(2)}X️，胜率{(this.props.winRate).toFixed(2)}</Text>
              <Text style={styles.rewardText}>您将赢得{(this.props.rewardTime * this.props.stake).toFixed(5)}以太坊</Text>
            </View>
          </View>
          <StakeModal/>
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
