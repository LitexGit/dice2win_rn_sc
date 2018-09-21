import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'
import Colors from '../../Themes/Colors';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  tabBarUnderlineStyle:{
    backgroundColor: Colors.tint,
  },

  sectionHeader:{
    flex:1,
    justifyContent: 'center',
    backgroundColor: Colors.cloud,
    padding: 3,
  },
  sectionHeaderText:{
    fontSize:14,
    color: Colors.charcoal
  },

  gameItem:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    padding: 5,
    borderTopWidth:1,
    borderTopColor:Colors.cloud,
    borderBottomWidth:0,
  },
  valueWrapper:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  gameText:{
    fontSize: 18,
    color:Colors.tint,
  },
  inValue:{
    fontSize: 24,
    color: Colors.facebook
  },
  outValue:{
    fontSize: 24,
    color: Colors.bloodOrange
  }
})
