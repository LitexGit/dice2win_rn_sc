import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import GameActions from '../Redux/GameRedux'
import WalletActions from '../Redux/WalletRedux'
import { displayETH } from '../Lib/Utils/format'
import styles from './Styles/ResultModalStyle'
import { connect } from 'react-redux'

// i18n
const STATUS_TEXT = {
  placing: 'Submitting to contract..',
  placed: 'Submitted, waiting for drawing..',
  drawn: 'Drawing now..',
  win: 'Congrats!!! YOU WIN:',
  lose: 'Sorry you lose..'
}

class ResultModal extends Component {

  render () {
    let {modulo, status, result} = this.props 
    console.tron.log('result: ', result)
    return (
      <View style={[styles.container, styles['container_'+status]]}>
        <View style={styles.content}>
          <Text style={styles.statusText}>{STATUS_TEXT[status]}</Text>
          {status==='win' && result.amount && <Text style={styles.amountText}>{displayETH(result.amount)} ETH!</Text>}
        </View>
        <View style={styles.buttonPanel}>
          <TouchableOpacity style={styles.buttonWrapper} onPress={_=>this.props.close(modulo, status)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    close: (modulo, status)=>{
      dispatch(GameActions.updateStatus({[modulo]:'idle'}))
      dispatch(WalletActions.walletRequest())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultModal)