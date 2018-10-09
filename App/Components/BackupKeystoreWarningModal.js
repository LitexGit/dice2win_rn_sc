import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/BackupKeystoreWarningModalStyle'
import Overlay from 'react-native-modal-overlay'

export default class BackupKeystoreWarningModal extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }
  state = {
    modalIsOpen: true
  }

  closeModal () {
    this.setState({modalIsOpen: false})
  }

  render () {
    return (
      <Overlay
        containerStyle={styles.modal}
        childrenWrapperStyle={styles.content}
        visible={this.state.modalIsOpen}
        animationType='zoomIn'
        animationDuration={300}>
        <View style={styles.header}>
          <Text style={styles.headerText}>警示：请勿截图</Text>
        </View>
        <View style={styles.actionWrapper}>
          <TouchableOpacity style={styles.confirmButton}
                            onPress={this.closeModal.bind(this)}>
            <Text style={styles.label}> 我知道了 </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    )
  }
}
