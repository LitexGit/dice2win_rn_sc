import React, { Component } from 'react'
import { View, Text} from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/GameDetailsStyles';
import {winOrLose} from '../Utils/Eth4FunUtils';

class GameDetailsView extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render () {
    const {item} = this.props;
    const {betMask=0, ra='', rb='', modulo=0} = item;
    const formula = 'Hash(A,B)mod2=';
    const isWin = winOrLose(betMask||0, modulo||0, ra, rb);
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
                <Text  numberOfLines={1} ellipsizeMode='tail' style={styles.desText}>Bet(B):{betMask == 0 ? 1 : 0}</Text>
                <Text  numberOfLines={1} ellipsizeMode='tail' style={styles.desText}>Random(b):{rb}</Text>
            </View>
          </View>

          <View style={styles.resultSection}>
            <Text style={[styles.desText, {marginTop: 25}]}>{formula}{isWin ? betMask : betMask == 0 ? 1 : 0 }</Text>
            <Text style={[styles.titleText, {marginTop: 10}]}>{winDes}</Text>
          </View>
    </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(GameDetailsView)
