import { StyleSheet } from 'react-native'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import Colors from '../../Themes/Colors'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  inputBox: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    justifyContent: 'center',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  inputText: {
    ...Fonts.style.h5,

    width: 300,
    color: Colors.text,
    flex: 5
  },
  icon: {
    position: 'absolute',
    top: 13,
    right: 0
  }
})
