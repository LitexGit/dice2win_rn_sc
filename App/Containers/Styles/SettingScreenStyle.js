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
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },

  settingLeft: {
    flex: 1,
  },

  settingRight: {
  },

  settingTitle: {
    ...Fonts.style.h5,
    color: Colors.silver,
    fontWeight: 'bold'
  },

  settingDesc: {
    fontSize: 14,
    color: Colors.steel,
    paddingLeft: 3
  },
})
