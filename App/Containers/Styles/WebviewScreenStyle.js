import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  webview: {
    flex: 1,
    height: 300,
    backgroundColor: Colors.coal
  }
})
