import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'
import ApplicationStyles from '../../Themes/ApplicationStyles'

export default StyleSheet.create({

  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'stretch',
    padding: 20,
  },
  titleBox: {
    margin: 10,
    alignItems: 'center',
  },
  titleText: {
    color: Colors.ricePaper,
    fontSize: 20
  },
  infoText: {
    color: Colors.ricePaper,
    fontSize: 16
  },
  mnemonicText: {
    color: Colors.ricePaper,
    fontSize: 25,
    marginTop: 20,
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
    margin: 0,
    alignItems: 'center',
    backgroundColor: Colors.casinoGreen,
  },

  textArea: {
    marginTop: 20,
    fontSize: 16,
    height: 150,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.steel,
    padding: 10,
    margin: 5,
    textAlignVertical: 'top',
  },
  darkButton: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderRadius: 6,
    margin: 5,
    alignItems: 'center',
    backgroundColor: Colors.silver,
  },
  lightButton: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderRadius: 6,
    margin: 5,
    alignItems: 'center',
    backgroundColor: Colors.charcoal,
  },
  darkText: {
    color: Colors.panther
  },
  lightText: {
    color: Colors.silver
  },

  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }
})
