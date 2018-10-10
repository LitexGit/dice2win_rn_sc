import React, { Component } from 'react'
import { View, Text, Image, SectionList, TouchableOpacity, RefreshControl } from 'react-native'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view'

import RecordActions from '../Redux/RecordRedux'
import {GAME_NAMES} from '../Redux/GameRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import { Colors, Images, Metrics } from '../Themes'
import ListEmptyComponent from '../Components/ListEmptyComponent'
import ListFooterComponent from '../Components/ListFooterComponent'

import { displayETH, formatDate } from '../Lib/Utils/format'
import styles from './Styles/RecordScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions';

const GAME_STATUS = ['preparing', 'submitted', 'drawing', 'complete', 'submitting', 'failed']

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
      type: 'game',
      game: { page: 0 },
      tx: { page: 0 },
    }
  }

  componentDidMount () {
    this._refresh()
  }

  _refresh = () => {
    let {type} = this.state
    this.setState({[type]:{page:0}})
    this.props.loadRecords(type, {page:0})
  }

  _loadMore = () => {
    if(this.props.loading){
      return
    }
    let {type} = this.state
    let {page} = this.state[type]

    page = page + 1
    this.setState({[type]:{page}})
    console.tron.log(`loading page ${page} of ${type}`)
    this.props.loadRecords(type, {page})
  }

  _renderSectionHeader = ({section}) => {
    return <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.key}</Text></View>
  }

  _itemPressed = (item) => {
    let {base_etherscan, navigate} = this.props
    navigate('WebviewScreen', {title: 'Bet ID:' + item.id, url: base_etherscan + item.tx_hash})
  }

  _renderGameItem = ({item}) => {
    let {modulo, amount:inValue, dice_payment:outValue, updated_at:time, status} = item

    let icon = Images[GAME_NAMES[modulo]]
    time = time.substring(time.indexOf('T')+1, time.indexOf('.'))
    return <TouchableOpacity style={styles.gameItem} onPress={this._itemPressed}>
      <View style={styles.timeWrapper}>
        <Text style={styles.timeText}>{time}</Text>
        <Text style={styles.statusText}>{GAME_STATUS[status]}</Text>
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
    let { remark, time, status, from, to, amount} = item
    let { address } = this.props

    let direction = from.localeCompare(address, 'en', {sensitivity: 'base'})?'in':'out'
    return <TouchableOpacity style={styles.gameItem} onPress={this._itemPressed}>
      <View style={styles.timeWrapper}><Text style={styles.timeText}>{time}</Text></View>
      {/* <View style={styles.valueWrapper}><Text style={styles.remarkText}>{status}</Text></View> */}
      <View style={styles.valueWrapper}>
        <Text style={styles[direction + 'comeValue']}>{(direction==='in'?'+':'-') + displayETH(amount)}</Text>
      </View>
    </TouchableOpacity>
  }

  _tabChanged = ({i,ref}) => {
    let type = ['game', 'tx'][i]
    console.tron.log('NewTab: ', type)
    this.setState({type}, ()=>{
      this._refresh()
    })
  }
  
  render () {
    let {gameSections, txSections, refreshing, loading} = this.props
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
                refreshing={refreshing}
                onRefresh={_=>this._refresh()}
                tintColor={Colors.tintColor}
                title="Refreshing..."
                titleColor={Colors.text}/>}
              sections={gameSections}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderGameItem}
              ListEmptyComponent={ListEmptyComponent}
              ListFooterComponent={gameSections.length && <ListFooterComponent
                loading={loading}
                onPress={this._loadMore.bind(this)}/>}
            />
          </View>
          <View tabLabel='Transactions' style={styles.container}>
            {/* Tx Section */}
            <SectionList
              refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={_=>this._refresh()}
                tintColor={Colors.tintColor}
                title="Refreshing..."
                titleColor={Colors.text}/>}
              sections={txSections}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderTxItem}
              ListEmptyComponent={ListEmptyComponent}
              ListFooterComponent={txSections.length && <ListFooterComponent
                loading={loading}
                onPress={this._loadMore.bind(this)}/>}
            />
          </View>
        </ScrollableTabView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let {refreshing, loading, game, tx} = state.record
  let {base_etherscan} = state.config
  let {address} = state.wallet
  return {
    refreshing, 
    loading,
    base_etherscan,
    address,
    gameSections: sectionlize(game),
    txSections: sectionlize(tx),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRecords: (type, data) => dispatch(RecordActions.recordRequest({type, data})),
    navigate: (routeName, params) => dispatch(NavigationActions.navigate({routeName, params}))
  }
}

const sectionlize = (items) => {
  let sections = []
  if(Array.isArray(items) && items.length) {
    let dateGroup = groupBy(items, 'date')
    let d = new Date()
    let today = formatDate(d)
    d.setDate(d.getDate() - 1)
    let yesterday = formatDate(d)
    Object.keys(dateGroup).forEach(key=>{
      let data = dateGroup[key]
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
