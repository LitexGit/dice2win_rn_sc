import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Images, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  list: {
    flexGrow: 1,
  },
  item: {
    flex:1,
    height: 50,
    borderWidth:0,
    borderBottomWidth: 1,
    borderColor: Colors.facebook,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  outText: {
    ...Fonts.style.h5,
    color: Colors.activeTint,
  }
})
