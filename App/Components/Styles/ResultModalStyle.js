import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    height: 200,
    margin: 30,
    padding: 30,
    backgroundColor: Colors.neetGray,
  },
  content:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusText: {
    ...Fonts.style.h6,
    color: Colors.text,
  },
  amountText:{
    ...Fonts.style.h4,
    color: Colors.bloodOrange,
  },

  buttonPanel: {
    height: 30,
    backgroundColor: Colors.casinoBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: Colors.text,
  }
})
