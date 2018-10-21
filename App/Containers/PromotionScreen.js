import React, { Component } from 'react'
import { Text, View, TouchableOpacity, SectionList, RefreshControl, Share } from 'react-native'
import Toast from 'react-native-root-toast'

import { connect } from 'react-redux'
import RecordActions from '../Redux/RecordRedux'

import { displayETH, sectionlize } from '../Lib/Utils/format'

import ListEmptyComponent from '../Components/ListEmptyComponent'
import ListFooterComponent from '../Components/ListFooterComponent'
import styles from './Styles/PromotionScreenStyle'
import {Colors} from '../Themes'
import I18n from '../I18n'

const TYPE = [
  '',
  'bonus',
  'withdraw'
]
const STATUS = [
  'pending',
  'success',
  'failed',
  'rejected',
  'approved',
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
    this._refresh()
  }

  _refresh = () => {
    this.setState({page: 1})
    this.props.loadRecords('bonus', 1)
  }

  _loadMore = () => {
    if(this.props.loading){
      return
    }

    let {page} = this.state
    page = page + 1
    this.setState({page})
    this.props.loadRecords('bonus', {page})
  }


  _withdraw = () => {
    Toast.show(I18n.t('WithdrawMsg'), {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
    })
  }

  _renderSectionHeader = ({section}) => {
    return <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.key}</Text></View>
  }

  _itemPressed = (item) => {
  }

  _renderItem = ({item}) => {
    let {time, address, status, amount, type, grade:level} = item
    status = STATUS[status]
    type = TYPE[type]
    return <TouchableOpacity style={styles.itemWrapper} onPress={_=>this._itemPressed(item)}>
      <View style={styles.timeWrapper}>
        <View style={styles.statusWrapper}><Text style={styles[type+'Text']}>{I18n.t(type)}</Text></View>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.timeWrapper}>
        <View style={styles.statusWrapper}><Text style={styles[status+'Text']}>{I18n.t(status)}</Text></View>
      </View>
      <View style={styles.sourceWrapper}>
        <View style={styles.statusWrapper}><Text style={styles.addressText} numberOfLines={1} ellipsizeMode='middle'>{address}</Text></View>
        <View style={styles.statusWrapper}><Text style={styles.levelText}>{I18n.t('RefLevel') + ': '}{level}</Text></View>
      </View>
      <View style={styles.valueWrapper}><Text style={styles.darkLabel}><Text style={styles.valueText}>{displayETH(amount)}</Text>  ETH</Text></View>
  </TouchableOpacity>
  }

  _shareLink = () => {
    let {shareInfo:{message, title, url}} = this.props
    Share.share({message, title, url})
      .then(result => {console.tron.log('share result: ', result)})
      .catch(err => console.tron.log('error open telegram', err))
  }
  render () {
    let {bonus, totalBonus, sections, refreshing, loading} = this.props
    console.tron.log('bonus sections', sections)
    return (
      <View style={styles.container}>
        <View style={styles.upWrapper}>
          <Text style={styles.label}>{I18n.t('Bonus2Withdraw')}</Text>
          <View style={styles.balanceWrapper}>
            <Text style={styles.balance}>{displayETH(bonus)}</Text>
            <Text style={styles.unit}> ETH</Text>
          </View>
          <TouchableOpacity style={styles.withdrawButton} onPress={_=>this._withdraw()}><Text style={styles.withdrawButtonText}>{I18n.t('Withdraw2Wallet')}</Text></TouchableOpacity>
          <Text style={[styles.label, {textAlign:'center'}]}>{I18n.t('TotalBonus') + ':\n'}<Text style={styles.valueText}>{displayETH(totalBonus)}</Text> ETH</Text>
          <TouchableOpacity onPress={this._shareLink.bind(this)}><Text style={styles.shareText}>{I18n.t('Share2Earn')}</Text></TouchableOpacity>
        </View>
        <View style={styles.downWrapper}>
          <SectionList
            refreshControl={<RefreshControl
              refreshing={refreshing}
              onRefresh={this._refresh}
              tintColor={Colors.tintColor}
              title="Refreshing..."
              titleColor={Colors.text}/>}
            sections={sections}
            renderSectionHeader={this._renderSectionHeader}
            renderItem={this._renderItem}
            ListEmptyComponent = {ListEmptyComponent}
            ListFooterComponent={sections.length && <ListFooterComponent
              loading={loading}
              onPress={this._loadMore}/>}
             />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    record: { bonus: list, refreshing, loading },
    user: { bonus, totalBonus, },
    config: {shareInfo},
  } = state
  return {
    refreshing, loading, sections: sectionlize(list), bonus, totalBonus, shareInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRecords: (type, data) => dispatch(RecordActions.recordRequest({type, data})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionScreen)
