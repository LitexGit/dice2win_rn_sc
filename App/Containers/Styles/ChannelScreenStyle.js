import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors } from '../../Themes/'
import { red, white } from 'ansi-colors';
// import Metrics from './Metrics'

const channelStatus = {
  padding: 15,
  textAlign:'center',
  alignItems:'center',
  justifyContent:'center',
  textAlignVertical:'center',
  fontSize: Fonts.size.h3
}

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  myBalance: {
    fontSize: Fonts.size.medium,
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.snow,
    paddingLeft: 35,
    paddingTop: 10
  },

  rivalBalance: {
    fontSize: Fonts.size.medium,
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.snow,
    paddingRight: 35,
    paddingTop: 10
  },



  channelStatusClosed: {
    color: 'red',
    ...channelStatus
  },

  channelStatusPending: {
    color: 'yellow',
    ...channelStatus
  },

  channelStatusActive: {
    color: 'green',
    ...channelStatus
  },

  buttonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-evenly",
  },

  rechargeButton: {
    width: 72,
    height: 36,
    padding: 8,
    backgroundColor: Colors.facebook,
    borderRadius: 5,
    alignItems: 'center'
  },

  depositButton: {
    width: 72,
    height: 36,
    padding: 8,
    backgroundColor: Colors.facebook,
    borderRadius: 5,
    alignItems: 'center'
  },

  buttonText: {
    ...Fonts.style.description,
    color: Colors.text,
  },


  item:{
    flexDirection:"row",
    paddingHorizontal:15,
    paddingVertical:20,

    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
  },
  leftSection:{
    flexDirection:"column",
    alignItems:'center',
    width:80,
  },
  centerSection:{
    flexDirection:"row",
    flex:1,
    paddingLeft: 10,
    paddingRight:20,
    alignItems: 'center',
  },
  rightSection:{
    flexDirection:"row",
    width:100,
    alignItems: 'center',
    justifyContent: 'flex-end',

  },

  sectionHeader:{
    flexDirection:"row",
    paddingHorizontal:15,
    paddingVertical:5,
    backgroundColor:'#666666',

    alignItems:'center',
  },
  sectionHeaderText:{
    color: '#FFFFFF',
  },

  channelTradingList:{
    marginTop:15,
    marginBottom:150,
  },

  winnerText:{
    color:'#4A90E2',
    fontSize: 16,
  },
  timeText:{
    color:'#f3f3f3',
    fontSize: 12,
  },
  fromText:{
    color:'#f3f3f3',
    fontSize: 12,
  },
  fromAddrText:{
    color:'#FFFFFF',
    fontSize: 12,
  },
  valueText:{
    color:'#F8E71C',
    fontSize: 16,
  }


})
