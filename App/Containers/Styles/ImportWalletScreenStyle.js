import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  tabBarStyle: {
    borderWidth:0
  },
  tabBarUnderlineStyle:{
    backgroundColor: Colors.activeTint,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'stretch',
  },
  content: {
    alignItems: 'stretch',
    padding: 20,
  },
  header: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    justifyContent: 'center',
  },
  headerText: {
    ...Fonts.style.h5,
    color: Colors.text
  },
  mnemonicInput: {
    fontSize: 16,
    height: 150,
    margin: 5,
    padding: 10,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.steel,
  },
  keystoreInput: {
    fontSize: 16,
    height: 250,
    margin: 5,
    padding: 5,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.steel,
  },

  actionWrapper: {
    height: 50,
    marginTop: 10,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },

  confirmButton: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
    alignItems: 'center',
    backgroundColor: Colors.casinoGreen,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.ember,
  },
  titleBox: {
    margin: 10,
    alignItems: 'center',
  },
  titleText: {
    color: Colors.ricePaper,
    fontSize: 18
  },
})
