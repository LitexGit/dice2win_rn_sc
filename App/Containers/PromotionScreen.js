import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, SectionList } from 'react-native'
import Toast from 'react-native-root-toast'
import Feather from 'react-native-vector-icons/Feather'

import { connect } from 'react-redux'
import RecordActions from '../Redux/RecordRedux'

import styles from './Styles/PromotionScreenStyle'

class PromotionScreen extends Component {
  static navigationOptions = {
    title: 'Promotion'
  }

  componentDidMount () {
    this.props.loadRecords('bonus')
  }

  _goto = (where) => {

  }

  _withdraw = () => {
    Toast.show('withdraw request submitted, please wait for review', {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
    })
  }

  _renderSectionHeader = ({section}) => {
    return <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.key}</Text></View>
  }

  _itemPressed = (item) => {
    Toast.show('from level: ' + item.fromLevel)
  }

  _renderItem = ({item}) => {
    let {time, fromUser, status, amount} = item
    return <TouchableOpacity style={styles.itemWrapper} onPress={_=>this._itemPressed(item)}>
      <View style={styles.timeWrapper}><Text style={styles.timeText}>{time}</Text></View>
      <View style={styles.valueWrapper}><Text style={styles.fromText} numberOfLines={1} ellipsizeMode='middle'>{fromUser}</Text></View>
      <View style={styles.valueWrapper}><Text style={styles.valueText}>{amount}</Text></View>
      <View style={styles.statusWrapper}><Text style={styles[status+'Text']}>{status}</Text></View>
  </TouchableOpacity>
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.upWrapper}>
          <View style={styles.shareWrapper}>
            <TouchableOpacity onPress={_=>this._goto('share')}><Feather style={styles.share} name={'share'} size={24} /></TouchableOpacity>
          </View>
          <Text style={styles.label}>bonus you can withdraw</Text>
          <View style={styles.balanceWrapper}>
            <Text style={styles.balance}>{this.props.wallet.bonus}</Text>
            <Text style={styles.unit}> ETH</Text>
          </View>
          <TouchableOpacity style={styles.withdrawButton} onPress={_=>this._withdraw()}><Text style={styles.withdrawButtonText}>withdraw to wallet</Text></TouchableOpacity>
          <Text style={styles.label}>you have earned {this.props.wallet.bonus} ETH so far</Text>
        </View>
        <View style={styles.downWrapper}>
          <SectionList
            sections={this.props.sectionData}
            renderSectionHeader={this._renderSectionHeader}
            renderItem={this._renderItem} />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  console.tron.log('state', state)
  return {
    sectionData: state.record.payload.sections,
    wallet: state.wallet.payload,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRecords: (type) => dispatch(RecordActions.recordRequest({type}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionScreen)
