import React, { Component } from 'react'
import { View, TextInput } from 'react-native'
import styles from './Styles/SinglePwdInputStyle'
import connect from 'react-redux/es/connect/connect'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SinglePwdInputActions from '../Redux/SinglePwdInputRedux'

class SinglePwdInput extends Component {

  componentDidMount () {
    this.props.init()
  }

  render () {
    const {pwd, pwdVis, changePwdVis, changePwdInput} = this.props
    return (
      <React.Fragment>
        <View style={styles.inputBox}>
          <TextInput style={styles.inputText}
                     autoFocus={false}
                     multiline={false}
                     placeholder='Input your password'
                     placeholderTextColor={'gray'}
                     secureTextEntry={pwdVis}
                     clearButtonMode='always'
                     underlineColorAndroid={'transparent'}
                     value={pwd}
                     keyboardType='numeric'
                     onChangeText={changePwdInput}/>
          <Icon style={styles.icon}
                name={!pwdVis ? 'visibility' : 'visibility-off'}
                size={25}
                color={this.props.iconColor}
                onPress={changePwdVis}/>
        </View>
      </React.Fragment>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    pwd: state.singlePwdInput.pwd,
    pwdVis: state.singlePwdInput.pwdVis,}
}

const mapDispatchToProps = (dispatch) => {
  return {
    init: () => dispatch(SinglePwdInputActions.init()),
    changePwdVis: () => dispatch(SinglePwdInputActions.changePwdVis()),
    changePwdInput: (val) => dispatch(SinglePwdInputActions.changePwdInput(val)),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePwdInput)
