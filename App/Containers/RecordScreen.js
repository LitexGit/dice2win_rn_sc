import React, { Component } from 'react'
import { View, Text, Image, SectionList, TouchableOpacity } from 'react-native'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view'
import Toast from 'react-native-root-toast'

import RecordActions from '../Redux/RecordRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import { Colors, Images, Metrics } from '../Themes'
import styles from './Styles/RecordScreenStyle'

class RecordScreen extends Component {
  static navigationOptions = {
    title: 'Records',
    tabBarLabel: 'Records',
    tabBarIcon: ({tintColor}) => (
      <FA5 name={'list'} size={Metrics.bottomTabIconSize} color={tintColor}/>
    )
  }

  componentDidMount () {
    this.props.loadRecords('game')
  }

  _renderSectionHeader = ({section}) => {
    return <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.key}</Text></View>
  }

  _itemPressed = (item) => {
    Toast.show('tx hash: ' + item.txhash)
  }

  _renderGameItem = ({item}) => {
    let icon = Images[item.type]
    let inValue = item.in && item.in.toFixed(2)
    let outValue = item.out && item.out.toFixed(2)
    let time = item.time

    return <TouchableOpacity style={styles.gameItem} onPress={_ => this._itemPressed(item)}>
      <View style={styles.timeWrapper}><Text style={styles.timeText}>{time}</Text></View>
      <View style={styles.iconWrapper}><Image style={styles.icon} resizeMode='contain' source={icon}/></View>
      <View style={styles.valueWrapper}><Text style={styles.label}>in: </Text><Text
        style={styles.inValue}>{inValue}</Text></View>
      <View style={styles.valueWrapper}><Text style={styles.label}>out: </Text><Text
        style={styles.outValue}>{outValue}</Text></View>
    </TouchableOpacity>
  }

  _renderTxItem = ({item}) => {
    let {type, remark, time, amount} = item
    amount = amount && amount.toFixed(2)

    return <TouchableOpacity style={styles.gameItem} onPress={_ => this._itemPressed(item)}>
      <View style={styles.timeWrapper}><Text style={styles.timeText}>{time}</Text></View>
      <View style={styles.valueWrapper}><Text style={styles.remarkText}>{remark}</Text></View>
      <View style={styles.valueWrapper}><Text
        style={styles[type + 'comeValue']}>{(type === 'in' ? '+' : '-') + amount}</Text></View>
    </TouchableOpacity>
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          initialPage={0}
          style={styles.tabBarStyle}
          tabBarActiveTextColor={Colors.activeTint}
          tabBarInactiveTextColor={Colors.inActiveTint}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={() => <ScrollableTabBar style={{borderBottomWidth: 0}}/>}
          onChangeTab={({i, ref}) => {
            this.props.loadRecords(i === 1 ? 'tx' : 'game')
          }}>
          <View tabLabel='Game History' style={styles.container}>
            {/* Game Section */}
            <SectionList
              sections={this.props.sectionData}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderGameItem}/>
          </View>
          <View tabLabel='Transactions' style={styles.container}>
            {/* Tx Section */}
            <SectionList
              sections={this.props.sectionData}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderTxItem}/>
          </View>
        </ScrollableTabView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  console.tron.log('NEW STATE', state.record.payload)
  return {
    sectionData: state.record.payload.sections,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRecords: (type) => dispatch(RecordActions.recordRequest({type}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordScreen)
