import React, { Component } from 'react'
import { View, Text} from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/GameDetailsStyles';
import {winOrLose} from '../Utils/Eth4FunUtils';

export default class GameDetailsView extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render () {
    // const {modulo={}, result={}} = this.props||{}
    // const {betMask=0, ra='388f1813ca873902d51f814', rb='966e94e50f403abcf'} = result.betDetail||{};
    // console.log('===============this.props=====================');
    // console.log(result);
    // console.log(result.betDetail);
    // console.log('===============this.props=====================');

    const betMask=0;
    const ra='388f1813ca873902d51f814';
    const rb='966e94e50f403abcf';
    const formula = 'winOrLose(web3, betMask, modulo, ra, rb, isPlayer）';

    // const isWin = winOrLose(betMask, modulo, ra, rb);
    const isWin = true;
    const winDes = isWin ? 'WIN：玩家P' : '庄家B';


    return (
      <View style={styles.container}>
      <Text style={styles.titleText}>链下开奖过程</Text>
      <View style={styles.paramSection}>
        <View style={[styles.playerSection, {marginRight: 10}]}>
            <Text style={[styles.titleText, {fontSize: 20}]}>玩家P</Text>
            <Text  numberOfLines={1} ellipsizeMode='tail' style={styles.desText}>Bet(P):{betMask}</Text>
            <Text  numberOfLines={1} ellipsizeMode='tail' style={styles.desText}>Random(P):{ra}</Text>
        </View>
        <View style={[styles.playerSection, {marginRight: 10,}]}>
            <Text style={[styles.titleText, {fontSize: 20}]}>庄家B</Text>
            <Text  numberOfLines={1} ellipsizeMode='tail' style={styles.desText}>Bet(B):{!betMask}</Text>
            <Text  numberOfLines={1} ellipsizeMode='tail' style={styles.desText}>Random(b):{rb}</Text>
        </View>
      </View>

      <View style={styles.resultSection}>
        <Text style={[styles.desText, {marginTop: 25}]}>{formula}</Text>
        <Text style={[styles.titleText, {marginTop: 10}]}>{winDes}</Text>
      </View>

    </View>
    )
  }
}

// const mapStateToProps = (state) => ({

// })

// const mapDispatchToProps = (dispatch) => ({

// })

// export default connect(mapStateToProps, mapDispatchToProps)(GameDetailsView)
