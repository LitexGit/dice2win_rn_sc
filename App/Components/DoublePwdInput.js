import React, { Component } from 'react'
import { View, TextInput } from 'react-native'
import styles from './Styles/DoublePwdInputStyle'
import connect from 'react-redux/es/connect/connect'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DoublePwdInputActions from '../Redux/DoublePwdInputRedux'

class DoublePwdInput extends Component {
  componentDidMount () {
    this.props.init()
  }

  render () {
    let {pwd1, pwd2, pwd1vis, pwd2vis, changePwd1Vis, changePwd2Vis, changePwd1Input, changePwd2Input} = this.props
    return (
      <React.Fragment>
        <View style={styles.inputBox}>
          <TextInput style={styles.inputText}
                     autoFocus={false}
                     multiline={false}
                     placeholder='Input your password'
                     placeholderTextColor={'gray'}
                     secureTextEntry={pwd1vis}
                     clearButtonMode='always'
                     value={pwd1}
                     keyboardType='numeric'
                     onChangeText={changePwd1Input}/>
          <Icon style={styles.icon}
                name={!pwd1vis ? 'visibility' : 'visibility-off'}
                size={25}
                color={this.props.iconColor}
                onPress={changePwd1Vis}/>
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput style={styles.inputText}
                     autoFocus={false}
                     multiline={false}
                     placeholder='Confirm your password'
                     placeholderTextColor={'gray'}
                     secureTextEntry={pwd2vis}
                     clearButtonMode='always'
                     value={pwd2}
                     keyboardType='numeric'
                     onChangeText={changePwd2Input}/>
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
    pwd1: state.doublePwdInput.pwd1,
    pwd2: state.doublePwdInput.pwd2,
    pwd1vis: state.doublePwdInput.pwd1vis,
    pwd2vis: state.doublePwdInput.pwd2vis,
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
