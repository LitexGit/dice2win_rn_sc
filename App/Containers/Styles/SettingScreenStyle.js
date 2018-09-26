import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'
import Colors from '../../Themes/Colors'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  settingList: {
    flex: 1
  },

  setting: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },

  settingLeft: {
    flex: 1,
    marginLeft: 5
  },

  settingRight: {
    marginRight: 5,
    paddingTop: 12,
  },

  settingTitle: {
    padding: 3,
    ...Fonts.style.h5,
    color: Colors.silver,
    fontWeight: 'bold'
  },

  settingDesc: {
    padding: 3,
    fontSize: 14,
    color: Colors.steel
  },
})
