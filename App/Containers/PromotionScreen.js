import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SectionList, Share } from 'react-native'
import Toast from 'react-native-root-toast'

import { connect } from 'react-redux'
import RecordActions from '../Redux/RecordRedux'

import { displayETH, sectionlize } from '../Lib/Utils/format'

import ListEmptyComponent from '../Components/ListEmptyComponent'
import styles from './Styles/PromotionScreenStyle'

const STATUS = [
  'pending',
  'success',
  'rejected',
]

class PromotionScreen extends Component {
  static navigationOptions = {
    title: 'Referral'
  }

  constructor(props) {
    super(props)

    this.state = {
      page: 1,
    }
  }

  componentDidMount () {
    let {page} = this.state
    this.props.loadRecords('bonus', {page})
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
    Toast.show('type' + item.type)
  }

  _renderItem = ({item}) => {
    let {time, address, status, amount, type, grade:level} = item
    status = STATUS[status]
    return <TouchableOpacity style={styles.itemWrapper} onPress={_=>this._itemPressed(item)}>
      <View style={styles.timeWrapper}>
        <View style={styles.statusWrapper}><Text style={styles[status+'Text']}>{status}</Text></View>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.valueWrapper}><Text style={styles.addressText} numberOfLines={1} ellipsizeMode='middle'>{address}</Text></View>
      <View style={styles.valueWrapper}><Text style={styles.valueText}>{displayETH(amount)} ETH</Text></View>
      <View style={styles.statusWrapper}><Text style={styles.levelText}>{level}</Text></View>
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
    console.tron.log('bonus sections', sections)
    return (
      <View style={styles.container}>
        <View style={styles.upWrapper}>
          <Text style={styles.label}>Bonus you can withdraw</Text>
          <View style={styles.balanceWrapper}>
            <Text style={styles.balance}>{displayETH(bonus)}</Text>
            <Text style={styles.unit}> ETH</Text>
          </View>
          <TouchableOpacity style={styles.withdrawButton} onPress={_=>this._withdraw()}><Text style={styles.withdrawButtonText}>Withdraw to wallet</Text></TouchableOpacity>
          <Text style={styles.label}>Total bonus you have earned: {displayETH(totalBonus)} ETH</Text>
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
  let {
    record: { bonus: list },
    user: { bonus, totalBonus, },
    config: {shareInfo},
  } = state
  return {
    sections: sectionlize(list), bonus, totalBonus, shareInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRecords: (type, data) => dispatch(RecordActions.recordRequest({type, data})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionScreen)
