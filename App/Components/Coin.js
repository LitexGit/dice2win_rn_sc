import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from './Styles/CoinStyle'
import Images from '../Themes/Images'
import BetActions from '../Redux/BetRedux'
import connect from 'react-redux/es/connect/connect'
import I18n from '../I18n'

class Coin extends Component {
  componentDidMount () {
    this.props.loadCoin()
    tracker.trackScreenView('Dice1')
  }

  render () {
    const {bets, clickCoin} = this.props
    return (
      <React.Fragment>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{I18n.t('GameCoin')}</Text>
        </View>
        <View style={styles.coinBox}>
          <TouchableOpacity onPress={clickCoin}>
            <Image style={styles.coinItem}
                   source={bets[0] ? Images.coinPosLight : Images.coinPosDark}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={clickCoin}>
            <Image style={styles.coinItem}
                   source={bets[1] ? Images.coinNegLight : Images.coinNegDark}/>
          </TouchableOpacity>
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
    loadCoin: () => dispatch(BetActions.loadCoin()),
    clickCoin: () => dispatch(BetActions.clickCoin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Coin)
