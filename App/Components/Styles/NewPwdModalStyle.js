import { StyleSheet } from 'react-native'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import Colors from '../../Themes/Colors'
import Fonts from '../../Themes/Fonts'

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
  },
  headerText: {
    ...Fonts.style.h5,
    color: Colors.text
  },
  content: {
    alignItems: 'stretch',
    backgroundColor: Colors.neetGray,
  },
  header: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionWrapper: {
    height: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    marginLeft:10,
    alignItems: 'center',
    backgroundColor: Colors.casinoGreen,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.ember,
  }
})
