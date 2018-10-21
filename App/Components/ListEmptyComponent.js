import React from 'react'
import { View, Text, Image } from 'react-native'
import styles from './Styles/ListEmptyComponentStyle'
import I18n from '../I18n'

export default class ListEmptyComponent extends React.PureComponent<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../Images/empty.png')} />
        <Text style={styles.text}>{I18n.t('NoRecord')}</Text>
      </View>
    );
  }
}
