import React, { Component } from 'react'
import { View, FlatList, Text, } from 'react-native'
import RecordActions from '../Redux/RecordRedux'
import { connect } from 'react-redux'
import styles from './Styles/GameRecordScreenStyle'
import ListEmptyComponent from '../Components/ListEmptyComponent'

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

class GameRecordScreen extends Component {

  constructor (props) {
    super (props)
    this.state = {
      page: 0,
      size: 20,
    }
  }
  componentDidMount () {
    let {page, size} = this.state
    let {loadRecords} = this.props

    loadRecords('global', {page, size})
  }

  _renderItem({item}) {
    return (
      <View style={styles.item}>
          <Text>out: </Text>
          <Text style={styles.outText}>{item.dice_payment/10e18}</Text>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <FlatList style={styles.list}
          data={this.props.records}
          renderItem={this._renderItem}
          ListEmptyComponent={ListEmptyComponent} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gameId: state.game.key,
    records: state.record.global
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRecords: (type, data) => dispatch(RecordActions.recordRequest({type, data}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameRecordScreen)
