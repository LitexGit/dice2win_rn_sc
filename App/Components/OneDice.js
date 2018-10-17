import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from './Styles/OneDiceStyle'
import Images from '../Themes/Images'
import BetActions from '../Redux/BetRedux'
import connect from 'react-redux/es/connect/connect'

const diceImage = [
  {
    pos: Images.diceOneLight,
    neg: Images.diceOneDark
  },
  {
    pos: Images.diceTwoLight,
    neg: Images.diceTwoDark
  },
  {
    pos: Images.diceThreeLight,
    neg: Images.diceThreeDark
  },
  {
    pos: Images.diceFourLight,
    neg: Images.diceFourDark
  },
  {
    pos: Images.diceFiveLight,
    neg: Images.diceFiveDark
  },
  {
    pos: Images.diceSixLight,
    neg: Images.diceSixDark
  }
]

class OneDice extends Component {
  componentDidMount () {
    this.props.loadOneDice()
  }

  renderDice (value, idx) {
    return (
      <TouchableOpacity key={idx} onPress={() => this.props.clickOneDice(idx)}>
        <Image style={styles.oneDiceItem}
          source={this.props.bets[idx] ? diceImage[idx].pos : diceImage[idx].neg}/>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <React.Fragment>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Choose the dice number(s)</Text>
        </View>
        <View style={styles.oneDiceBox}>
          {this.props.diceWeights.map((value, idx) => (idx < 3) && this.renderDice(value, idx))}
        </View>
        <View style={styles.oneDiceBox}>
          {this.props.diceWeights.map((value, idx) => (idx >= 3) && this.renderDice(value, idx))}
        </View>
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
    loadOneDice: () => dispatch(BetActions.loadOneDice()),
    clickOneDice: (idx) => dispatch(BetActions.clickOneDice(idx))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OneDice)
