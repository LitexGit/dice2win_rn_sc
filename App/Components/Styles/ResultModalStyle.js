import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    height: 200,
    margin: 30,
    padding: 30,
    backgroundColor: Colors.neetGray,
    alignItems: 'stretch'
  },
  container_win: {
    backgroundColor: Colors.facebook,
  },
  container_lose: {
    backgroundColor: Colors.charcoal,
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
    marginTop: 5,
    ...Fonts.style.h4,
    color: Colors.bloodOrange,
  },

  buttonPanel:{
    height: 30,
    alignItems: 'stretch',
    justifyContent: 'center'
  },

  buttonWrapper: {
    flex:1,
    backgroundColor: Colors.casinoBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: Colors.text,
  }
})
