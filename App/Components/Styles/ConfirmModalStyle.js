import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors } from '../../Themes'

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
  ethWrapper:{
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cloud,
  },
  ethText: {
    ...Fonts.style.h5,
    color: Colors.bloodOrange,
  },

  fromToWrapper: {
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cloud,
  },
  fromToText: {
    color: 'grey',
    fontSize: 11,
  },

  sliderWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  slider:{
    flex:1,
  },

  gasWrapper: {
    paddingTop: 3,
    paddingBottom: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cloud,
  },
  gasStatus:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  gasText:{
    color: Colors.bloodOrange,
  },
  autoGasButton:{
    backgroundColor: Colors.cloud,
    borderRadius: 3,
    padding: 5,
    paddingBottom: 3,
    paddingTop: 3,
  },
  autoGasText:{
    fontSize: 12,
    color: Colors.casinoGreen,
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
  cancelButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.ember,
  }
})
