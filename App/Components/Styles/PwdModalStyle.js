import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts } from '../../Themes'

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
