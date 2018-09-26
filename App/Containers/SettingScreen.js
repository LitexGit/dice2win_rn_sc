import React, { Component } from 'react'
import { View, FlatList, Text, Switch } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SettingScreenStyle'
import SettingActions from '../Redux/SettingRedux'

const entries = [
  {'key':'msg_noti', 'title': 'Event Notification', 'desc': 'game result, activities, etc', 'switch': true},
  {'key':'tx_noti', 'title': 'Transaction Notification', 'desc': 'transactions, bonus, etc', 'switch': true},
  {'key':'language', 'title': 'Language'},
]

class SettingScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
    tabBarLabel: 'Settings'
  }

  _switchValueChanged = (item, newValue) => {
    let newState = {[item.key]:newValue}
    console.tron.log('new setting', newState)
    this.props.setSetting(newState)
  }

  _renderItem ({item}) {
    return (
      <View style={styles.setting}>
        <View style={styles.settingLeft}>
          <Text style={styles.settingTitle}> {item.title} </Text>
          {item.desc && <Text style={styles.settingDesc}> {item.desc} </Text>}
        </View>
        <View style={styles.settingRight}>
          {item.switch && <Switch value={this.props.settings[item.key]} onValueChange={(newValue) => this._switchValueChanged(item, newValue)} />}
          {item.key === 'language' && <Text style={styles.settingTitle}>{this.props.settings[item.key]}</Text>}
        </View>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.settingList}>
          <FlatList
            data={entries}
            renderItem={this._renderItem.bind(this)}
            extraData={this.props.settings}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.setting.payload
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadSetting: () => dispatch(SettingActions.settingRequest()),
    setSetting: (value) => dispatch(SettingActions.settingSuccess(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)
