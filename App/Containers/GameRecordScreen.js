import React, { Component } from 'react'
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native'
import RecordActions from '../Redux/RecordRedux'
import { connect } from 'react-redux'
import styles from './Styles/GameRecordScreenStyle'
import Images from '../Themes/Images'
import ListEmptyComponent from '../Components/ListEmptyComponent'
import { displayETH } from '../Lib/Utils/format'

const GAME_STATUS = [
  {text: 'wait', style:{color:'gray'}},
  {text: 'win', style:{color:'darkorange'}},
  {text: 'lose', style:{color: 'mediumaquamarine'}},
]

const Bet = ({modulo, bet}) => <View style={styles.betWrapper}> 
  { modulo==2 && <Image style={styles.icon} source={bet==1?Images.coinPosLight:Images.coinNegLight} /> }
  { modulo==6 && <Text style={styles.betText}>{bet.toString()}</Text> }
  { modulo==36 &&
    <View style={{alignItems:'center',justifyContent:'space-between'}}>
      <Text style={styles.betText}>{bet.slice(0,4).toString()}</Text>
      { bet.length>4 && <Text style={styles.betText}>{bet.slice(4,8).toString()}</Text> }
      { bet.length>8 && <Text style={styles.betText}>{bet.slice(8).toString()}</Text> }
    </View> }
  { modulo==100 && <Text style={styles.betText}>{'≤' + bet}</Text> }
</View>

const Result = ({modulo, result}) => <View>
  { modulo===2 && <Image style={styles.icon} source={result=='0'?Images.coinPosLight:Images.coinNegLight} /> }
  { modulo===6 && <Text style={styles.resultText}>{result}</Text> }
  { modulo===36 && <Text style={styles.resultText}>{result}</Text> }
  { modulo===100 && <Text style={styles.resultText}>{result}</Text> }
</View>

class GameRecordScreen extends Component {

  constructor (props) {
    super (props)
    this.state = {
      page: 1,
      size: 20,
    }
  }
  componentDidMount () {
    let {page, size} = this.state
    let {loadRecords} = this.props

    loadRecords('global', {page, size})
  }
  _itemPressed = (item) => {

  }

  _renderItem = ({item}) => {
    let { amount:inValue, address_from:user, dice_payment:outValue, time, bet_res:status, bet_mask:bet, bet_detail:result} = item
    let { modulo } = this.props
    return <TouchableOpacity style={styles.gameItem} onPress={_=>this._itemPressed(item)}>
      <View style={styles.timeWrapper}>
        <Text style={[styles.statusText, GAME_STATUS[status].style]}>{GAME_STATUS[status].text}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      
      <View style={styles.userWrapper}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.userText}>{user}</Text>
      </View>

      <Bet modulo={modulo} bet={bet} />

      <View style={styles.inWrapper}>
        <Text style={styles.darkLabel}>in: </Text>
        <Text style={styles.inValue}>{displayETH(inValue, 2)}</Text>
      </View>

      <View style={styles.resultWrapper}>
        <Result modulo={modulo} result={result} />
      </View>

      <View style={styles.outWrapper}>
        <Text style={styles.darkLabel}>out: </Text>
        <Text style={styles.outValue}>{displayETH(outValue, 2)}</Text>
      </View>
    </TouchableOpacity>
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
  let { 
    game:{key:modulo},
    record:{global},
  } = state

  return {
    modulo,
    records: global[modulo],
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRecords: (type, data) => dispatch(RecordActions.recordRequest({type, data}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameRecordScreen)
