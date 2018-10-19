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

import { displayETH, sectionlize } from '../Lib/Utils/format'
import styles from './Styles/RecordScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions';

const GAME_STATUS = [
  {text: 'wait', style:{color:'gray'}},
  {text: 'win', style:{color:'darkorange'}},
  {text: 'lose', style:{color: 'mediumaquamarine'}},
]

const TX_STATUS = [
  {},
  {text: 'stake'},
  {text: 'transfer'},
  {text: 'bonus'},
  {text: 'bonus'},
  {text: 'winning'}
]

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
      game: { page: 1 },
      tx: { page: 1 },
    }
  }

  componentDidMount () {
    this._refresh()
  }

  _refresh = () => {
    let {type} = this.state
    this.setState({[type]:{page:1}})
    this.props.loadRecords(type, {page:1})
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
    navigate('WebviewScreen', {title: 'ID: ' + item.id, url: base_etherscan + item.tx_hash})
  }

  _renderGameItem = ({item}) => {
    let {modulo, amount:inValue, dice_payment:outValue, time, bet_res: status} = item
    let icon = Images[GAME_NAMES[modulo]]

    return <TouchableOpacity style={styles.gameItem} onPress={_=>this._itemPressed(item)}>
      <View style={styles.timeWrapper}>
        <Text style={[styles.statusText, GAME_STATUS[status].style]}>{GAME_STATUS[status].text}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.iconWrapper}><Image style={styles.icon} resizeMode='contain' source={icon}/></View>
      <View style={styles.inWrapper}>
        <Text style={styles.darkLabel}>in: </Text>
        <Text style={styles.inValue}>{displayETH(inValue, 4)}</Text>
      </View>
      <View style={styles.outWrapper}>
        <Text style={styles.darkLabel}>out: </Text>
        <Text style={styles.outValue}>{displayETH(outValue, 4)}</Text>
      </View>
    </TouchableOpacity>
  }

  _renderTxItem = ({item}) => {
    let { remark, time, status, from, to, amount} = item
    let { address } = this.props
    console.tron.log('renderTxItem amount', amount, status)
    if(amount < 0.000001 || status == 4)
      return <View />

    let type = from.localeCompare(address, 'en', {sensitivity: 'base'})?'in':'out'
    let direction = type==='in'?'from':'to'
    return <TouchableOpacity style={styles.txItem} onPress={_=>this._itemPressed(item)}>
      <View style={[styles.timeWrapper, {width: 80}]}>
        <Text style={styles.statusText}>{TX_STATUS[status].text}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.addressWrapper}>
        <Text numberOfLines={1} ellipsizeMode='middle' style={styles.addressText}><Text style={{width: 20, textAlign:'right', color:'gray'}}>{direction}: </Text>{eval(direction)}</Text>
      </View>
      <View style={styles.valueWrapper}>
        <Text style={styles[type + 'comeValue']}>{(type==='in'?'+':'-') + displayETH(amount)}</Text>
      </View>
    </TouchableOpacity>
  }

  _tabChanged = ({i,ref}) => {
    let type = ['game', 'tx'][i]
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
                onRefresh={this._refresh}
                tintColor={Colors.tintColor}
                title="Refreshing..."
                titleColor={Colors.text}/>}
              sections={gameSections}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderGameItem}
              ListEmptyComponent={ListEmptyComponent}
              ListFooterComponent={gameSections.length && <ListFooterComponent
                loading={loading}
                onPress={this._loadMore}/>}
            />
          </View>
          <View tabLabel='Transactions' style={styles.container}>
            {/* Tx Section */}
            <SectionList
              refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={this._refresh}
                tintColor={Colors.tintColor}
                title="Refreshing..."
                titleColor={Colors.text}/>}
              sections={txSections}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderTxItem}
              ListEmptyComponent={ListEmptyComponent}
              ListFooterComponent={txSections.length && <ListFooterComponent
                loading={loading}
                onPress={this._loadMore}/>}
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


export default connect(mapStateToProps, mapDispatchToProps)(RecordScreen)
