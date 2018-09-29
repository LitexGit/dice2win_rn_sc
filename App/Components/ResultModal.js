import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import styles from './Styles/ResultModalStyle'
import GameActions, { updateStatus } from '../Redux/GameRedux'
import { connect } from 'react-redux'

// i18n
const STATUS_TEXT = {
  place: 'Submitted to contract, waiting for drawing..',
  drawn: 'Drawing now..',
  win: 'Congrats!!! YOU WIN:',
  lose: 'Sorry you lose..'
}

class ResultModal extends Component {
  // Prop type warnings
  // static propTypes = {
  //   show: PropTypes.bool.isRequired,
  //   status: PropTypes.string.isRequired,
  //   result: PropTypes.object,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render () {
    let {status, result} = this.props 
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={status!='close'}
        onRequestClose={() => {}}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.statusText}>{STATUS_TEXT[status]}</Text>
            {status==='win' && result && <Text style={styles.resultText}>{result.amount}</Text>}
          </View>
          <View style={styles.buttonPanel}>
            <TouchableOpacity style={styles.buttonWrapper} onPress={_=>this.props.close()}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.game.status,
    result: state.game.result,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(GameActions.updateStatus('close'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultModal)