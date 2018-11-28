import React, { Component } from 'react'
import { View, Text, Image, SectionList, TouchableOpacity, RefreshControl } from 'react-native'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view'

import ChannelActions from '../Redux/ChannelRedux'
import RecordActions from '../Redux/RecordRedux'
import {GAME_NAMES} from '../Redux/GameRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import { Colors, Images, Metrics } from '../Themes'
import ListEmptyComponent from '../Components/ListEmptyComponent'
import ListFooterComponent from '../Components/ListFooterComponent';
import GameDetailsView from '../Components/GameDetailsView'


import { displayETH, sectionlize } from '../Lib/Utils/format'
import styles from './Styles/RecordScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions';
import I18n from '../I18n';

import {getWinAmount} from '../Utils/Eth4FunUtils'

const GAME_STATUS = [
  {text: I18n.t('wait'), style:{color:'gray'}},
  {text: I18n.t('win'), style:{color:'darkorange'}},
  {text: I18n.t('lose'), style:{color: 'mediumaquamarine'}},
]

const TX_STATUS = [
  {},
  {text: I18n.t('stake')},
  {text: I18n.t('transfer')},
  {text: I18n.t('recharge')},
  {text: I18n.t('bonus')},
  {text: I18n.t('withdrawal')}
]

class RecordScreen extends Component {
  static navigationOptions = {
    title: I18n.t('RecordTabTitle'),
    tabBarLabel: I18n.t('RecordTabLabel'),
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
    if (!W.address) return;
    let {type} = this.state
    this.setState({[type]:{page:1}})
    if(type == 'tx') {
      this.props.loadTxRecords('tx', {page:1})
    } else {
      this.props.loadGameRecords('game', {page:1})
    }
  }

  _loadMore = () => {
    if (!W.address) return;
    if(this.props.loading) {
      return
    }
    let {type} = this.state
    let {page} = this.state[type]

    page = page + 1
    this.setState({[type]:{page}})
    if(type == 'tx') {
      this.props.loadTxRecords('tx', {page})
    } else {
      this.props.loadGameRecords('game', {page})
    }
  }

  _renderSectionHeader = ({section}) => {
    return <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.key}</Text></View>
  }

  _itemPressed = (item) => {
    const {type} = this.state
    if(type == 'tx') {
      let {base_etherscan, navigate} = this.props
      navigate('WebviewScreen', {title: 'ID: ' + item.id, url: base_etherscan + item.tx_hash})
      return;
    }
    // game
    checkType='selected';
    this.props.checkGameDetail({item, checkType});
  }

  _onMomentumScrollBegin=()=>{
    checkType='scrollBegin';
    const item={};
    this.props.checkGameDetail({item, checkType});
  }

  _renderGameItem = ({item}) => {

    let {modulo, value:inValue, winAmount:outValue, time, winner: status, isOpen} = item;
    let icon = Images[GAME_NAMES[modulo]];

    const winValue = 2 * displayETH(getWinAmount({winner:status, outValue}), 4);

    return (
      <View>
        <TouchableOpacity style={styles.gameItem} onPress={_=>this._itemPressed(item)}>
          <View style={styles.timeWrapper}>
            <Text style={[styles.statusText]}>{status==1?'赢了':'输了'}</Text>
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <View style={styles.iconWrapper}><Image style={styles.icon} resizeMode='contain' source={icon}/></View>
          <View style={styles.inWrapper}>
            <Text style={styles.darkLabel}>in: </Text>
            <Text style={styles.inValue}>{displayETH(inValue, 4)}</Text>
          </View>
          <View style={styles.outWrapper}>
            <Text style={styles.darkLabel}>out: </Text>
            <Text style={styles.outValue}>{winValue}</Text>
          </View>
        </TouchableOpacity>
        {isOpen && <GameDetailsView item={item}/>}
      </View>
    )

    /*
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
    */
  }

  _renderTxItem = ({item}) => {
    let { remark, direction, time, status, from, to, amount} = item
    let { address } = this.props
    if(amount < 0.000001 || status == 4)
      return <View />
    let mark = direction==='in'?'from':'to'
    console.tron.log(item, mark)
    return <TouchableOpacity style={styles.txItem} onPress={_=>this._itemPressed(item)}>
      <View style={[styles.timeWrapper, {width: 80}]}>
        <Text style={styles.statusText}>{TX_STATUS[status].text}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.addressWrapper}>
        <Text numberOfLines={1} ellipsizeMode='middle' style={styles.addressText}>
        <Text style={{width: 20, textAlign:'right', color:'gray'}}>{mark}: </Text>{eval(mark)}</Text>
      </View>
      <View style={styles.valueWrapper}>
        <Text style={styles[direction + 'comeValue']}>{(direction=='in'?'+':'-') + displayETH(amount)}</Text>
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
    let {gameSections=[], txSections, refreshing, loading} = this.props;

    return (
      <View style={styles.container}>
        <ScrollableTabView
          initialPage={0}
          style={styles.tabBarStyle}
          tabBarActiveTextColor={Colors.activeTint}
          tabBarInactiveTextColor={Colors.inActiveTint}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={() => <DefaultTabBar style={{borderBottomWidth: 0}}/>}
          onChangeTab={this._tabChanged.bind(this)}>
          <View tabLabel={I18n.t('GameHistory')} style={styles.container}>
            {/* Game Section */}
            <SectionList
              refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={this._refresh}
                tintColor={Colors.tintColor}
                title={I18n.t('Refreshing')+".."}
                titleColor={Colors.text}/>}
              sections={gameSections}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderGameItem}
              ListEmptyComponent={ListEmptyComponent}
              ListFooterComponent={gameSections.length && <ListFooterComponent
                loading={loading}
                onPress={this._loadMore}/>}
              onMomentumScrollBegin={this._onMomentumScrollBegin}
            />
          </View>
          <View tabLabel={I18n.t('Transactions')} style={styles.container}>
            {/* Tx Section */}
            <SectionList
              refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={this._refresh}
                tintColor={Colors.tintColor}
                title={I18n.t('Refreshing')+".."}
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
  const {tx} = state.record;
  const {refreshing, loading, game=[]} = state.channel;
  const {base_etherscan} = state.config
  const {address} = state.wallet

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
    loadTxRecords: (type, data) => dispatch(RecordActions.recordRequest({type, data})),
    loadGameRecords: (type, data) => dispatch(ChannelActions.getAllBets({type, data})),
    navigate: (routeName, params) => dispatch(NavigationActions.navigate({routeName, params})),
    checkGameDetail: (item, checkType) => dispatch(ChannelActions.checkGameDetail({item, checkType})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordScreen)
