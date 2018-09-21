import React, { Component } from 'react'
import { View, Text, SectionList, TouchableOpacity} from 'react-native'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Toast from 'react-native-root-toast'

import RecordActions from '../Redux/RecordRedux'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import Colors from '../Themes/Colors'
import styles from './Styles/RecordScreenStyle'

class RecordScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Records',
    tabBarIcon:({tintColor}) => (
      <FA5 name={'list'} size={26} color={tintColor}/>
    )
  }
  componentDidMount(){
    this.props.loadRecords('game')
  }

  _renderSectionHeader = ({section}) => {
    return <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>Date: {section.key}</Text></View>
  }

  _itemPressed = (item) => {
    Toast.show('tx hash: ' + item.txhash)
  }

  _renderGameItem = ({item}) => {
    return <TouchableOpacity style={styles.gameItem} onPress={_=>this._itemPressed(item)}>
      <View style={styles.valueWrapper}><Text style={styles.gameText}>{item.type}</Text></View>
      <View style={styles.valueWrapper}><Text>in: </Text><Text style={styles.inValue}>{item.in}</Text></View>
      <View style={styles.valueWrapper}><Text>out: </Text><Text style={styles.outValue}>{item.out}</Text></View>
    </TouchableOpacity>
  }
  
  _renderTxItem = ({item}) => {
    return <TouchableOpacity style={styles.gameItem} onPress={_=>this._itemPressed(item)}>
      <View style={styles.valueWrapper}><Text style={styles.gameText}>{item.type}</Text></View>
      <View style={styles.valueWrapper}><Text style={styles.outValue}>{item.amount}</Text></View>
    </TouchableOpacity>
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollableTabView 
          initialPage={0}
          tabBarActiveTextColor={Colors.tint}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={()=><ScrollableTabBar />}
          onChangeTab={({i, ref}) => {
            console.tron.log('TAB:', i)
            this.props.loadRecords(i===1?'tx':'game')
          }}>
          <View tabLabel='Game History' style={styles.container}>
            {/* Game Section */}
            <SectionList
              sections={this.props.sectionData}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderGameItem} />
          </View>
          <View tabLabel='Transactions' style={styles.container}>
            {/* Tx Section */}
            <SectionList
              sections={this.props.sectionData}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderTxItem} />
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
