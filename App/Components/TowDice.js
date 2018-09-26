import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from './Styles/TowDiceStyle'
import Images from '../Themes/Images'
import BetActions from '../Redux/BetRedux'
import connect from 'react-redux/es/connect/connect'

const bets = [true, false, true, false, true, false, true, false, true, false, true]

class TwoDice extends Component {
  componentDidMount () {
    // this.props.loadTwoDice()
  }

  renderDice (freq, idx) {
    return (
      <TouchableOpacity key={idx} onPress={() => this.props.clickTwoDice(idx)}>
        <Image style={styles.twoDiceItem}
               source={this.props.bets[idx] ? Images.diceLight : Images.diceDark}/>
        <Text> {idx + 2} </Text>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <React.Fragment>
        <View style={styles.twoDiceBox}>
          {this.props.diceWeights.map((value, idx) => this.renderDice(value, idx))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>选择硬币的一面来进行投注</Text>
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
    loadTwoDice: () => dispatch(BetActions.loadTwoDice()),
    clickTwoDice: (idx) => dispatch(BetActions.clickTwoDice(idx))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TwoDice)
