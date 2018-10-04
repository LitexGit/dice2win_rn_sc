import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '../../Themes'

const IMAGE_SIZE = 70
export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    flexGrow: 1,
  },
  text: {
    margin: 10,
    fontSize: 16,
    color: Colors.steel,
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  }
})
