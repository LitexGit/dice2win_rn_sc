import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  myBalance: {
    ...Fonts.style.normal,
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.snow,
    paddingLeft: 35,
    paddingTop: 10
  },

  rivalBalance: {
    ...Fonts.style.normal,
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.snow,
    paddingRight: 35,
    paddingTop: 10
  },

  channelStatus: {
    padding: 15,
    color: 'red',
    textAlign:'center',
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    fontSize: Fonts.size.h3
  },

  buttonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-evenly",
  },

  rechargeButton: {
    width: 72,
    height: 36,
    padding: 8,
    backgroundColor: Colors.facebook,
    borderRadius: 5,
    alignItems: 'center'
  },

  depositButton: {
    width: 72,
    height: 36,
    padding: 8,
    backgroundColor: Colors.facebook,
    borderRadius: 5,
    alignItems: 'center'
  },

  buttonText: {
    ...Fonts.style.description,
    color: Colors.text,
  }
})
