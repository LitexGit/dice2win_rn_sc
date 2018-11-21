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
import ListFooterComponent from '../Components/ListFooterComponent'

import { displayETH, sectionlize } from '../Lib/Utils/format'
import styles from './Styles/RecordScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions';
import I18n from '../I18n'

const GAME_STATUS = [
  {text: I18n.t('wait'), style:{color:'gray'}},
  {text: I18n.t('win'), style:{color:'darkorange'}},
  {text: I18n.t('lose'), style:{color: 'mediumaquamarine'}},
]

const TX_STATUS = [
  {},
  {text: I18n.t('stake')},
  {text: I18n.t('transfer')},
  {text: I18n.t('bonus')},
  {text: I18n.t('bonus')},
  {text: I18n.t('winning')}
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
    let {type} = this.state

    this.setState({[type]:{page:1}})
    if(type == 'tx') {
      this.props.loadTxRecords('tx', {page:1})
    } else {
      this.props.loadGameRecords('game', {page:1})
    }
  }

  _loadMore = () => {
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
    let {base_etherscan, navigate} = this.props
    navigate('WebviewScreen', {title: 'ID: ' + item.id, url: base_etherscan + item.tx_hash})
  }

  /**
    betId: 99
    betMask: "1"
    channelId: "0xf06be3caa544e2e43f460e3900bca841258bc07e18a95a850d8362c5f289694a"
    createdAt: "2018-11-15 05:25:26.117 +00:00"
    date: "2018-11-15"
    gameContractAddress: "0xE44C8bA910A179A801267442224F9B7f3065E0ec"
    hashRa: "0xc76e920b7d7d93c10db53a86fd4f2310014a7972647287ae76cdd16c1d101e28"
    modulo: 2
    negativeB: "0x633177eeE5dB5a2c504e0AE6044d20a9287909f9"
    positiveA: "0x56d77fcb5e4Fd52193805EbaDeF7a9D75325bdC0"
    ra: "fd5c1e7eec6a93a3d0c44a6519bc142242a5e4169275b40a56b2be966d06b6c700e2f3f4b6d5dada6216ca89cd46000690c39f62c6ef21dc57949824ab7da570"
    rb: "f48fd63082398c86049a25847669ad82c096beba43723c82e5aeffd597d6e5067883aced0245eccdbad3565dd6edf0c436a3929d548dbdb72cf9597368d3a059"
    round: 99
    signatureA: "0x6410e718728f95432900dd464156ff13ced073b4930c9e444c3fbffa5bae4c0277d29173c3522b722d6267a352bacffdf69f51d023ed134a6a3207a4107ea4621b"
    signatureB: "0x7fc73a2ce89630d81570d0091d846af54afc0c750ccbabd37e7d7b3f6c1fe53969808b47fb9e070381ea11c6ed978a6ec5e8853a241811ffcc0336bc2cfeae0a1b"
    status: 8
    time: "13:25:26"
    updatedAt: "2018-11-15 05:25:26.201 +00:00"
    value: "100000000000000"
    winAmount: "96000000000000"
    winner: "0"
   */
  _renderGameItem = ({item}) => {

    let {modulo, value:inValue, winAmount:outValue, time, winner: status} = item
    let icon = Images[GAME_NAMES[modulo]]
    return <TouchableOpacity style={styles.gameItem} onPress={_=>this._itemPressed(item)}>
    <View style={styles.timeWrapper}>
      <Text style={[styles.statusText]}>{status==0?'输了':'赢了'}</Text>
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
    let {gameSections, txSections, refreshing, loading} = this.props;

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
  const {refreshing, loading, game} = state.channel;
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
    navigate: (routeName, params) => dispatch(NavigationActions.navigate({routeName, params}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordScreen)
