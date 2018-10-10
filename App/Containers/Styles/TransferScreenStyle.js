import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'stretch',
    padding: 20,
  },
  content: {
    alignItems: 'stretch',
    backgroundColor: Colors.neetGray,
  },
  header: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // alignContent: 'center',
    justifyContent: 'center',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
  },
  headerText: {
    ...Fonts.style.h5,
    color: Colors.text,

    width: Metrics.screenWidth - 40,
  },
  valueText: {
    ...Fonts.style.h5,
    color: Colors.text,
    width: Metrics.screenWidth - 40,
  },
  ETH: {
    ...Fonts.style.h5,
    color: Colors.text,

    position: 'absolute',
    top: 13,
    right: 38
  },
  toInput: {
    marginTop: 20,
    fontSize: 16,
    height: 50,
    margin: 5,
    padding: 5,
    color: Colors.text
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

