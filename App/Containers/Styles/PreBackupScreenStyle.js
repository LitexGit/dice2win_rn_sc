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
    borderWidth: 1,
    borderColor: Colors.steel,
    padding: 10,
    marginBottom: 10,
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
})
