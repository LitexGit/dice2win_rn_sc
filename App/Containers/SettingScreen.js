import React, { Component } from 'react'
import { View, FlatList, Text, Switch } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SettingScreenStyle'
import SettingActions from '../Redux/SettingRedux'

class SettingScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
    tabBarLabel: 'Settings'
  }

  complete (value) {
    alert('here')
  }

  // 构造方法,初始化state
  constructor (props) {
    super(props)

    this.complete.bind(this)
  }

  _renderItem ({item}) {
    return (
      <View style={styles.setting}>
        <View style={styles.settingLeft}>
          <Text style={styles.settingTitle}> {item.title} </Text>
          <Text style={styles.settingDesc}> {item.desc} </Text>
        </View>

        <View style={styles.settingRight}>
          {item.switch && <Switch value={item.checked}
          />}
        </View>
      </View>
    )
  }

  componentDidMount () {
    this.props.loadSetting()
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.settingList}>
          <FlatList
            data={this.props.settings}
            renderItem={this._renderItem}
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
    setSetting: (value) => dispatch(SettingActions.settingSuccess({'checked': value}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)
