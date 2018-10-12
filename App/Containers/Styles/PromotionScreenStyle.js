import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  upWrapper:{
    height: 200,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.facebook,
    borderBottomWidth: 1,
  },

  shareWrapper:{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  share:{
    color: Colors.facebook,
    margin: 15,
  },

  balanceWrapper:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    margin: 5,
  },
  balance:{
    ...Fonts.style.h2,
    color: Colors.activeTint,
  },

  withdrawButton: {
    backgroundColor: Colors.facebook,
    paddingTop: 5,
    paddingBottom: 5,
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },

  withdrawButtonText: {
    ...Fonts.style.h5,
    color: Colors.snow,
  },

  unit: {
    fontSize: 16,
    color: Colors.text,
  },

  shareText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: Colors.activeTint,
    marginTop: 10,
  },

  downWrapper: {
    flex: 1,
  },

  sectionHeader:{
    flex:1,
    justifyContent: 'center',
    backgroundColor: Colors.neetGray,
    padding: 3,
  },
  sectionHeaderText:{
    fontSize:14,
    color: Colors.snow,
  },

  itemWrapper: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    padding: 5,
    color: Colors.silver,
    borderTopWidth:0,
    borderBottomWidth:1,
    borderBottomColor:Colors.cloud,
  },

  timeWrapper:{
    width: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  valueWrapper:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  timeText: {
    fontSize: 12,
    color: Colors.silver
  },
  addressText: {
    color: 'lightgrey'
  },
  valueText:{
    fontSize: 16,
    color: Colors.activeTint
  },

  levelText: {
    color: Colors.bloodOrange,
    fontWeight: '500',
  },

  statusWrapper:{
    width: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  successText: {
    color: Colors.casinoGreen
  },
  pendingText: {
    color: Colors.silver
  },
  rejectText: {
    color: Colors.fire
  }
})
