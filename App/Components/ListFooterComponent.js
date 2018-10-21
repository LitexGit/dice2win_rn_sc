import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/ListFooterComponentStyle'
import I18n from '../I18n'
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
    text: I18n.t('LoadMore'),
  }

  render () {
    let {loading, text, onPress} = this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.footerButton} onPress={onPress}>
          <Text style={styles.footerText}>{loading?I18n.t('Loading')+'..':text}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
