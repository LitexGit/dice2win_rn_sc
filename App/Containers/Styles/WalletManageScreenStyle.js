import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container:{
    flex:1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 100,
  },
  buttonWrapper: {
    width: 200,
    backgroundColor: Colors.facebook,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    alignItems: 'center'
  },

  buttonText: {
    ...Fonts.style.h5,
    color: Colors.text,
  }
})
