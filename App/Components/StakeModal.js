import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native'
import styles from './Styles/CoinStyle'
import Images from '../Themes/Images'
import StakeModalActions from '../Redux/StakeModalRedux'
import connect from 'react-redux/es/connect/connect'

class StakeModal extends Component {

  render () {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.modalIsOpen}
          onRequestClose={() => {
            alert('Modal has been closed.')
          }}
        >
          <View style={{padding: 30}}>
            <View style={{marginTop: 50, flex: 1}}>

              <Text style={{color: '#000', alignSelf: 'center'}}>{this.props.stake}Eth</Text>
            </View>
            <View style={{marginTop: 0, flex: 1}}>
              <Text>From</Text>

              <Text style={{color: '#000', alignSelf: 'center'}}/>
            </View>
            <View style={{marginTop: 0, flex: 1}}>
              <Text>To</Text>
              <Text style={{color: '#000', alignSelf: 'center'}}>0xAe985667078744A8EFb0C6c0300D7861EF427148</Text>

            </View>
            <View style={styles.listBox}>
              <Text>Gas费用</Text>
              <Text style={{color: '#000'}}>6G Wei</Text>
            </View>
            <View style={styles.listBox}>
              <Text>最大总计</Text>
              <Text style={{color: '#000'}}>{this.props.stake}</Text>
            </View>

            <View style={{marginTop: 22, flex: 3}} style={styles.stakeBox}>

              <TouchableOpacity full dark style={{marginTop: 20}} onPress={this.props.closeStakeModal}>
                <Text> 批 准 </Text>
              </TouchableOpacity>
              <TouchableOpacity full dark style={{marginTop: 20}} onPress={this.props.closeStakeModal}>
                <Text> 取 消 </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: '#000',
                alignSelf: 'center',
                marginTop: 50
              }}>{this.props.loading ? '正在提交……' : ''}</Text>
          </View>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modalIsOpen: state.stakeModal.modalIsOpen,
    stake: state.game.stake,
    loading: state.stakeModal.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openStakeModal: () => dispatch(StakeModalActions.openStakeModal()),
    closeStakeModal: () => dispatch(StakeModalActions.closeStakeModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StakeModal)
