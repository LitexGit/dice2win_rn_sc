import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes';

export default StyleSheet.create({
  container:{
    height: 300,
    paddingVertical: 30,
    marginHorizontal: 30,
    alignContent: 'center',
  },
  paramSection:{
    flexDirection: 'row',
    paddingTop: 20,
  },
  resultSection:{
    paddingTop: 20,
  },
  playerSection:{
    flex:1,
  },
  titleText:{
    textAlign:'center',
    color:'#FFFFFF',
    fontSize: 24,
  },
  desText:{
    textAlign:'left',
    color:'#FFFFFF',
    marginTop: 8,
    fontSize: 14,

  }
})
