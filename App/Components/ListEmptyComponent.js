import React from 'react'
import { View, Text, Image } from 'react-native'
import styles from './Styles/ListEmptyComponentStyle'

export default class ListEmptyComponent extends React.PureComponent<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../Images/empty.png')} />
        <Text style={styles.text}>No Records</Text>
      </View>
    );
  }
}
