import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import styles from './Styles/TwoDiceStyle'
import Images from '../Themes/Images'
import BetActions from '../Redux/BetRedux'
import connect from 'react-redux/es/connect/connect'
import { Colors } from '../Themes';

const bets = [true, false, true, false, true, false, true, false, true, false, true]


class TwoDice extends Component {
  componentDidMount () {
    this.props.loadTwoDice()
  }

  renderDice (freq, idx) {
    return (
      <TouchableOpacity style={styles.towDiceWrapper} key={idx} onPress={() => this.props.clickTwoDice(idx)}>
        <ImageBackground style={styles.twoDiceItem} source={this.props.bets[idx] ? Images.diceBGLight : Images.diceBGDark}>
          <Text style={[styles.twoDiceText, !this.props.bets[idx] && {color:Colors.border}]}> {idx + 2} </Text>
        </ImageBackground>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <React.Fragment>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Choose sum of dice to bet on </Text>
        </View>
        <View style={styles.twoDiceBox}> {this.props.diceWeights.map((value, idx) => idx < 4 && this.renderDice(value, idx))} </View>
        <View style={styles.twoDiceBox}> {this.props.diceWeights.map((value, idx) => idx >= 4 && idx < 8 && this.renderDice(value, idx))} </View>
        <View style={styles.twoDiceBox}> {this.props.diceWeights.map((value, idx) => idx >= 8 && this.renderDice(value, idx))} </View>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    bets: state.bet.bets,
    betsCount: state.bet.betsCount,
    diceWeights: state.bet.diceWeights,
    rewardTime: state.bet.rewardTime,
    betMaskArr: state.bet.betMaskArr
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadTwoDice: () => dispatch(BetActions.loadTwoDice()),
    clickTwoDice: (idx) => dispatch(BetActions.clickTwoDice(idx))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TwoDice)
