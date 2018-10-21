import React, { Component } from 'react'
import { View, FlatList, Text, Switch } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SettingScreenStyle'
import SettingActions from '../Redux/SettingRedux'
import I18n from '../I18n'
import LangPicker from '../Components/LangPicker';


class SettingScreen extends Component {
  static navigationOptions = {
    title: I18n.t('SettingScreenTitle'),
  }

  _switchValueChanged = (item, newValue) => {
    let newState = {[item.key]:newValue}
    this.props.setSetting(newState)
  }

  _renderItem ({item}) {
    let {title, desc, switch:needSwitch, key} = item
    return (
      <View style={styles.setting}>
        <View style={styles.settingLeft}>
          <Text style={styles.settingTitle}> {title} </Text>
          {desc && <Text style={styles.settingDesc}> {desc} </Text>}
        </View>
        <View style={styles.settingRight}>
          {needSwitch && <Switch value={this.props[key]} onValueChange={(newValue) => this._switchValueChanged(item, newValue)} />}
          {/* {key === 'language' && <LangPicker />} */}
          {key === 'language' && <Text style={{color: 'grey'}}>{I18n.t('ComingSoon')}..</Text>}
        </View>
      </View>
    )
  }

  render () {
    let {language} = this.props
    let entries = [
      {'key':'msg_noti', 'title': I18n.t('MsgNotiTitle', {locale: language}), 'desc': I18n.t('MsgNotiDesc', {locale: language}), 'switch': true},
      {'key':'tx_noti', 'title': I18n.t('TxNotiTitle'), 'desc': I18n.t('TxNotiDesc'), 'switch': true},
      {'key':'language', 'title': I18n.t('LangSelectTitle')},
    ]
    return (
      <View style={styles.container}>
        <View style={styles.settingList}>
          <FlatList
            data={entries}
            renderItem={this._renderItem.bind(this)}
            extraData={this.props}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...{ msg_noti, tx_noti, language } = state.setting,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadSetting: () => dispatch(SettingActions.settingRequest()),
    setSetting: (value) => dispatch(SettingActions.settingSuccess(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)
