import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts } from '../../Themes'
import Metrics from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  modal: {
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    alignItems: 'stretch',
    backgroundColor: Colors.neetGray,
  },
  header: {
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    width: '100%',
    ...Fonts.style.h5,
    color: Colors.text
  },

  statusWrapper: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errText: {
    color: Colors.fire
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
  },

  inputBox: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
    justifyContent: 'center',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  inputText: {
    ...Fonts.style.h5,

    width: Metrics.screenWidth - 120,
    color: Colors.text,
    flex: 5
  },
  icon: {
    position: 'absolute',
    top: 13,
    right: 0
  }
})
