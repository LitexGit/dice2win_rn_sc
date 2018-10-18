import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts } from '../../Themes'
import Metrics from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    alignItems: 'stretch',
    width: '80%',
    backgroundColor: Colors.neetGray,
    padding: 0,
  },
  header: {
    height: 40,
    backgroundColor: Colors.ember,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    ...Fonts.style.h5,
    color: Colors.text
  },
  statusWrapper: {
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: Colors.text,
  },
  warningText: {
    color: Colors.bloodOrange,
  },
  errText: {
    color: Colors.fire
  },
  actionWrapper: {
    height: 60,
    margin: 15,
    marginTop: 0,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  confirmButton: {
    flex: 1,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    backgroundColor: Colors.casinoGreen,
    borderRadius: 1,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    backgroundColor: Colors.ember,
  },

})
