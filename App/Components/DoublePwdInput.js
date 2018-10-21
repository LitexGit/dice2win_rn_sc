import React, { Component } from 'react'
import { View, TextInput } from 'react-native'
import styles from './Styles/DoublePwdInputStyle'
import connect from 'react-redux/es/connect/connect'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DoublePwdInputActions from '../Redux/DoublePwdInputRedux'
import I18n from '../I18n'

class DoublePwdInput extends Component {
  componentDidMount () {
    this.props.init()
  }

  render () {
    let {pwd1, pwd2, pwd1vis, pwd2vis, pwd1valid, pwd2valid, changePwd1Vis, changePwd2Vis, changePwd1Input, changePwd2Input} = this.props
    return (
      <React.Fragment>
        <View style={pwd1==='' ? styles.inputBox : (pwd1valid ? styles.inputBoxValid : styles.inputBoxUnvalid)}>
          <TextInput style={styles.inputText}
                     autoFocus={this.props.focus}
                     multiline={false}
                     maxLength={20}
                     placeholder={I18n.t('Password')+'('+I18n.t('length')+':8-20)'}
                     placeholderTextColor={'gray'}
                     underlineColorAndroid={'transparent'}
                     secureTextEntry={pwd1vis}
                     clearButtonMode='always'
                     value={pwd1}
                     onChangeText={val=>changePwd1Input(val.trim())}/>
          <Icon style={styles.icon}
                name={!pwd1vis ? 'visibility' : 'visibility-off'}
                size={25}
                color={this.props.iconColor}
                onPress={changePwd1Vis}/>
        </View>
        <View style={pwd2==='' ? styles.inputBox : (pwd2valid ? styles.inputBoxValid : styles.inputBoxUnvalid)}>
          <TextInput style={styles.inputText}
                     autoFocus={false}
                     multiline={false}
                     maxLength={20}
                     placeholder={I18n.t('ConfirmPwd')}
                     placeholderTextColor={'gray'}
                     underlineColorAndroid={'transparent'}
                     secureTextEntry={pwd2vis}
                     clearButtonMode='always'
                     value={pwd2}
                     onChangeText={val=>changePwd2Input(val.trim())}/>
          <Icon style={styles.icon}
                name={!pwd2vis ? 'visibility' : 'visibility-off'}
                size={25}
                color={this.props.iconColor}
                onPress={changePwd2Vis}/>
        </View>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pwd1: state.doublePwdInput.pwd1.trim(),
    pwd2: state.doublePwdInput.pwd2.trim(),
    pwd1vis: state.doublePwdInput.pwd1vis,
    pwd2vis: state.doublePwdInput.pwd2vis,
    pwd1valid: state.doublePwdInput.pwd1valid,
    pwd2valid: state.doublePwdInput.pwd2valid,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    init: () => dispatch(DoublePwdInputActions.init()),
    changePwd1Vis: () => dispatch(DoublePwdInputActions.changePwd1Vis()),
    changePwd2Vis: () => dispatch(DoublePwdInputActions.changePwd2Vis()),
    changePwd1Input: (val) => dispatch(DoublePwdInputActions.changePwd1Input(val)),
    changePwd2Input: (val) => dispatch(DoublePwdInputActions.changePwd2Input(val)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DoublePwdInput)
