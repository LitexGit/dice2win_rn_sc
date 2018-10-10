import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/ListFooterComponentStyle'

export default class ListFooterComponent extends Component {
  // // Prop type warnings
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    text: PropTypes.string,
    onPress: PropTypes.func.isRequired
  }
  // Defaults for props
  static defaultProps = {
    loading: false,
    text: 'load more',
  }

  render () {
    let {loading, text, onPress} = this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.footerButton} onPress={onPress}>
          <Text style={styles.footerText}>{loading?'loading..':text}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
