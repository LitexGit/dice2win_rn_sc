import React, { Component } from 'react'
import { View, TextInput } from 'react-native'
import styles from './Styles/SinglePwdInputStyle'
import connect from 'react-redux/es/connect/connect'
import Icon from 'react-native-vector-icons/MaterialIcons'

class SinglePwdInput extends Component {

  state = {
    pwd1: '',
    pwd1vis: true,
  }

  changePwd1Vis () {
    this.setState({pwd1vis: !this.state.pwd1vis})
  }

  render () {
    return (
      <React.Fragment>
        <View style={styles.inputBox}>
          <TextInput style={styles.inputText}
                     autoFocus={true}
                     multiline={false}
                     placeholder='Input your password'
                     placeholderTextColor={'gray'}
                     secureTextEntry={this.state.pwd1vis}
                     clearButtonMode='always'
                     value={this.state.pwd1}
                     onChangeText={val => this.setState({pwd1: val})}/>
          <Icon style={styles.icon}
                name={!this.state.pwd1vis ? 'visibility' : 'visibility-off'}
                size={25}
                color={this.props.iconColor}
                onPress={this.changePwd1Vis.bind(this)}/>
          />
        </View>
      </React.Fragment>
    )
  }
}


const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePwdInput)
