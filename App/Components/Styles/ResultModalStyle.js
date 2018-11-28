import { StyleSheet, PixelRatio } from 'react-native'
import { Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  detailSection:{
    flex:1,
  },

  container: {
    height: 200,
    margin: 30,
    padding: 30,
    backgroundColor: Colors.neetGray,
    alignItems: 'stretch'
  },
  container_win: {
    backgroundColor: Colors.facebook,
  },
  container_lose: {
    backgroundColor: Colors.windowTint,
  },

  content:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusText: {
    ...Fonts.style.h6,
    color: Colors.text,
  },
  amountText:{
    marginTop: 5,
    ...Fonts.style.h4,
    color: Colors.bloodOrange,
  },

  buttonPanel:{
    height: 40,
    alignItems: 'stretch',
    justifyContent: 'center'
  },

  buttonWrapper: {
    flex:1,
    flexDirection: 'row',
    backgroundColor: Colors.casinoBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: Colors.text,
    margin: 5,
  },
  refreshIcon :{
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    margin: 5,
  },


  bottomSection:{
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

  },
  itemSeparator:{
    width: 1 / PixelRatio.get(),
    backgroundColor:Colors.separate_line_color,
  },
  flatList:{
    backgroundColor: 'red',
  }
})
