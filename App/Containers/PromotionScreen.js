import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SectionList, Share } from 'react-native'
import Toast from 'react-native-root-toast'

import { connect } from 'react-redux'
import RecordActions from '../Redux/RecordRedux'

import ListEmptyComponent from '../Components/ListEmptyComponent'
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

  _shareLink = () => {
    let {shareInfo:{message, title, url}} = this.props
    Share.share({message, title, url})
      .then(result => {console.tron.log('share result: ', result)})
      .catch(err => console.tron.log('error open telegram', err))
  }
  render () {
    let {bonus, totalBonus, sections} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.upWrapper}>
          {/* <View style={styles.shareWrapper}>
            <TouchableOpacity onPress={_=>this._goto('share')}><Feather style={styles.share} name={'share'} size={24} /></TouchableOpacity>
          </View> */}
          <Text style={styles.label}>Bonus you can withdraw</Text>
          <View style={styles.balanceWrapper}>
            <Text style={styles.balance}>{bonus}</Text>
            <Text style={styles.unit}> ETH</Text>
          </View>
          <TouchableOpacity style={styles.withdrawButton} onPress={_=>this._withdraw()}><Text style={styles.withdrawButtonText}>withdraw to wallet</Text></TouchableOpacity>
          <Text style={styles.label}>You have earned {totalBonus} ETH so far</Text>
          <TouchableOpacity onPress={this._shareLink.bind(this)}><Text style={styles.shareText}>SHARE to earn MORE</Text></TouchableOpacity>
        </View>
        <View style={styles.downWrapper}>
          <SectionList
            sections={sections}
            renderSectionHeader={this._renderSectionHeader}
            renderItem={this._renderItem}
            ListEmptyComponent = {ListEmptyComponent}
             />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...{sections} = state.record.bonus,
    ...{bonus, totalBonus} = state.user,
    ...{shareInfo} = state.config,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRecords: (type) => dispatch(RecordActions.recordRequest({type}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionScreen)
