import React, { Component } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/BackupScreenStyle'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Colors from '../Themes/Colors'
import AppConfig from '../Config/AppConfig'

Array.prototype.remove = function (val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}

class BackupScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mnemonic: AppConfig.wallet.mnemonic,
      textareaArray: [],
      textarea: '',
      stateWord: [],
      wordState: []
    }

  }

  componentDidMount () {
    this._displayWord()
  }

  _displayWord () {
    console.log(this.state)
    var mnemonic = this.state.mnemonic
    // var words = mnemonic.split(' ').sort(()=> .5 - Math.random());
    var words = mnemonic.split(' ')
    var wordState = new Array()
    words.map((item, i) => wordState[item] = true)
    this.setState({stateWord: words, wordState: wordState}, () => {
      console.log(this.state)
    })
  }

  _addWord (item) {
    var wordState = this.state.wordState
    var textarea = this.state.textarea
    var textareaArray = this.state.textareaArray
    textareaArray.push(item)
    console.log(textareaArray)
    textarea === '' ? textarea = item : textarea = textarea + ' ' + item
    textarea = textareaArray.join(' ')
    wordState[item] = !wordState[item]
    this.setState({
      wordState: wordState,
      textarea: textarea,
      textareaArray: textareaArray
    })
  }

  _rmWord (idx) {
    var wordState = this.state.wordState
    var textareaArray = this.state.textareaArray
    textareaArray.remove(idx)
    console.log(textareaArray)
    var textarea = textareaArray.join(' ')
    wordState[idx] = !wordState[idx]
    this.setState({
      wordState: wordState,
      textarea: textarea,
      textareaArray: textareaArray
    })
  }

  _checkMnemonic () {
    console.log('textarea:' + this.state.textarea)
    console.log('mnemonic:' + this.state.mnemonic)
    if (this.state.textarea === this.state.mnemonic) {

      this.props.navigate('BottomTab')
    }
    else {
      alert('输入错误哦！')
    }
  }

  renderItem (item, i) {
    return (
      <TouchableOpacity dark={this.state.wordState[item]} light={!this.state.wordState[item]} style={styles.button}
                        onPress={() => {
                          this.state.wordState[item] ? this._addWord(item) : this._rmWord(item)
                        }} key={i}><Text style={{color: Colors.text}}>{item}</Text></TouchableOpacity>
    )

  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Text style={{
          marginTop: 20,
          fontSize: 16,
          color: Colors.text,
        }}>Backup Container</Text>
        <TextInput placeholder="输入助记词，按空格分隔；或者直接点击助记词按钮输入"
                   style={{
                     marginTop: 20,
                     fontSize: 16,
                     height: 150,
                     border: 2,
                     color: Colors.text,
                   }}
                   multiline={true}
                   numberOfLines={5}
                   value={this.state.textarea}
                   onChangeText={(textarea) => this.setState({textarea})}/>
        {this.state.stateWord.map((item, i) => this.renderItem(item, i))}
        <TouchableOpacity full dark style={{marginTop: 20}} onPress={() => this._checkMnemonic()}>
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            color: Colors.text,
          }}>确定</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mnemonic: state.wallet.wallet.mnemonic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (target) => dispatch(NavigationActions.navigate({routeName: target})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupScreen)
