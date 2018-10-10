import React, { Component } from 'react'
import { View, Text, Image, SectionList, TouchableOpacity, RefreshControl } from 'react-native'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view'
import Toast from 'react-native-root-toast'

import RecordActions from '../Redux/RecordRedux'
import {GAME_NAMES} from '../Redux/GameRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import { Colors, Images, Metrics } from '../Themes'
import ListEmptyComponent from '../Components/ListEmptyComponent'
import { displayETH } from '../Lib/Utils/format'
import styles from './Styles/RecordScreenStyle'


class RecordScreen extends Component {
  static navigationOptions = {
    title: 'Records',
    tabBarLabel: 'Records',
    tabBarIcon: ({tintColor}) => (
      <FA5 name={'list'} size={Metrics.bottomTabIconSize} color={tintColor}/>
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      game: {
        page: 0,
        size: 10,
      },
      tx: {
        page: 0,
        size: 10,
      },
    }
  }

  _refresh = (type='game') => {
    this.setState({[type]:{page:0, size:10}})
    let {page, size} = this.state[type]
    this.props.loadRecords(type, {page, size})
  }

  _loadMore = (type) => {
    let data = {page:this.state[type].page + 1, size:this.state[type].size}
    this.setState({[type]:data})
    this._refresh(type)
  }

  componentDidMount () {
    this._refresh()
  }

  _renderSectionHeader = ({section}) => {
    return <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.key}</Text></View>
  }

  _itemPressed = (item) => {
    Toast.show('tx hash: ' + item.txhash)
  }

  _renderGameItem = ({item}) => {
    let {modulo, amount:inValue, dice_payment:outValue, updated_at:time, status} = item

    let icon = Images[GAME_NAMES[modulo]]
    time = time.substring(time.indexOf('T')+1, time.indexOf('.'))
    return <TouchableOpacity style={styles.gameItem} onPress={_ => this._itemPressed(item)}>
      <View style={styles.timeWrapper}>
        <Text style={styles.timeText}>{time}</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>
      <View style={styles.iconWrapper}><Image style={styles.icon} resizeMode='contain' source={icon}/></View>
      <View style={styles.inWrapper}>
        <Text style={styles.label}>in: </Text>
        <Text style={styles.inValue}>{displayETH(inValue)}</Text>
      </View>
      <View style={styles.outWrapper}>
        <Text style={styles.label}>out: </Text>
        <Text style={styles.outValue}>{displayETH(outValue)}</Text>
      </View>
    </TouchableOpacity>
  }

  _renderTxItem = ({item}) => {
    let {type, remark, time, amount} = item

    return <TouchableOpacity style={styles.gameItem} onPress={_ => this._itemPressed(item)}>
      <View style={styles.timeWrapper}><Text style={styles.timeText}>{time}</Text></View>
      <View style={styles.valueWrapper}><Text style={styles.remarkText}>{remark}</Text></View>
      <View style={styles.valueWrapper}><Text
        style={styles[type + 'comeValue']}>{(type === 'in' ? '+' : '-') + displayETH(amount)}</Text></View>
    </TouchableOpacity>
  }

  _tabChanged = ({i,ref}) => {
    let type = ['game', 'tx'][i]
    console.tron.log('NewTab: ', type)
    this._refresh(type)
  }
  
  render () {
    let {gameSections, txSections, fetching} = this.props
    return (
      <View style={styles.container}>
        <ScrollableTabView
          initialPage={0}
          style={styles.tabBarStyle}
          tabBarActiveTextColor={Colors.activeTint}
          tabBarInactiveTextColor={Colors.inActiveTint}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={() => <ScrollableTabBar style={{borderBottomWidth: 0}}/>}
          onChangeTab={this._tabChanged.bind(this)}>
          <View tabLabel='Game History' style={styles.container}>
            {/* Game Section */}
            <SectionList
              refreshControl={<RefreshControl
                refreshing={fetching}
                onRefresh={_=>this._refresh()}
                tintColor={Colors.tintColor}
                title="Refreshing..."
                titleColor={Colors.text}/>}
              sections={gameSections}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderGameItem}
              ListEmptyComponent={ListEmptyComponent}
              />
          </View>
          <View tabLabel='Transactions' style={styles.container}>
            {/* Tx Section */}
            <SectionList
              refreshControl={<RefreshControl
                refreshing={fetching}
                onRefresh={_=>this._refresh()}
                tintColor={Colors.tintColor}
                title="Refreshing..."
                titleColor={Colors.text}/>}
              sections={txSections}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderTxItem}
              ListEmptyComponent={ListEmptyComponent}
              />
          </View>
        </ScrollableTabView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let {fetching, game, tx} = state.record
  return {
    fetching,
    gameSections: sectionlize(game),
    txSections: sectionlize(tx),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRecords: (type, data) => dispatch(RecordActions.recordRequest({type, data}))
  }
}

const sectionlize = (items) => {
  let sections = []
  if(Array.isArray(items) && items.length) {
    let dateGroup = groupBy(items, 'date')
    let d = new Date()
    let today = d.toLocaleDateString('zh-CN').split('/').join('-')
    d.setDate(d.getDate() - 1)
    let yesterday = d.toLocaleDateString('zh-CN').split('/').join('-')

    Object.keys(dateGroup).forEach(key=>{
      let data = dateGroup[key]
      console.tron.log(key, today)
      key===today && (key='today')
      key===yesterday && (key='yesterday')
      sections.push({ key, data })
    })
  }

  return sections
}

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    acc
    return acc;
  }, {});
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordScreen)
