import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  sliderWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  slider:{
    flex:1,
    margin: 5,
  },
  rateWrapper:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateText: {
    ...Fonts.style.h4, 
    color: Colors.silver,
    margin: 10,
  },
  infoBox: {
    flex: 1,
    alignSelf: 'center',
    margin: 10, 
  },
  infoText: {
    color: Colors.ricePaper,
    fontSize: 18
  },
})
