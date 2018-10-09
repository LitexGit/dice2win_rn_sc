import { StyleSheet } from 'react-native'
import Colors from '../../Themes/Colors'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({

  ...ApplicationStyles.screen,

  modal: {
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    alignItems: 'stretch',
    backgroundColor: Colors.border,
  },

  header: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    ...Fonts.style.h5,
    color: Colors.text
  },


  actionWrapper: {
    height: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  confirmButton: {
    flex: 3,
    padding: 10,
    marginLeft:10,
    alignItems: 'center',
    backgroundColor: Colors.casinoGreen,
  },
})
