import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Picker } from 'react-native'
import SettingActions from '../Redux/SettingRedux'
import { connect } from 'react-redux'
import I18n from '../I18n'
import styles from './Styles/LangPickerStyle'

const LANGS = {
  'en': 'English',
  'zh': '简体中文',
}

class LangPicker extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      showPicker: false,
    }
  }

  render () {
    let {style=styles.container, textStyle=styles.titleText, pickerStyle=styles.picker,
      language, updateLanguage} = this.props

    I18n.locale = language

    console.tron.log('i18n', I18n)

    return (
      <View style={style}>
        <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}} onPress={_=>this.setState({showPicker: true})}>
          <Text style={textStyle}>{LANGS[language]}</Text>
        </TouchableOpacity>
        { this.state.showPicker && <Picker
          style={pickerStyle}
          selectedValue={language}
          onValueChange={ (value, index) => updateLanguage({ language: value })}>
          {Object.keys(LANGS).map(k => <Picker.Item label={LANGS[k]} value={k} />)}
        </Picker>}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  ...{language} = state.setting,
})

const mapDispatchToProps = (dispatch) => ({
  updateLanguage: (language) => dispatch(SettingActions.settingSuccess(language))
})

export default connect(mapStateToProps, mapDispatchToProps)(LangPicker)
