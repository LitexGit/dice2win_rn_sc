import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'
import Colors from '../../Themes/Colors';

const ICON_SIZE = 24

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  tabBarStyle: {
    borderWidth:0
  },
  tabBarUnderlineStyle:{
    backgroundColor: Colors.activeTint,
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

  gameItem:{
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  iconWrapper:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  valueWrapper:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  icon:{
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  label: {
    color: Colors.silver
  },
  inValue:{
    fontSize: 24,
    color: Colors.casinoGreen
  },
  outValue:{
    fontSize: 24,
    color: Colors.activeTint
  },

  remarkText:{
    color: Colors.silver,
  },
  timeText: {
    color: Colors.ricePaper,
  },
  incomeValue:{
    fontSize: 24,
    color: Colors.activeTint
  },
  outcomeValue:{
    fontSize: 24,
    color: Colors.casinoGreen
  },
})
