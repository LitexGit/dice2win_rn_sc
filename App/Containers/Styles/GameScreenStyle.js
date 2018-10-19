import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts } from '../../Themes'

const SLIDE_HEIGHT = 150
const ENTRY_HEIGHT = 80

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  swiper:{
    height: SLIDE_HEIGHT,
  },
  slide: {
    height: SLIDE_HEIGHT,
    justifyContent: 'center',
    backgroundColor: Colors.coal
  },
  image: {
    flex:1,
    height: SLIDE_HEIGHT,
    backgroundColor: 'transparent'
  },

  noticeBar: {
    height: 30,
    padding: 5,
    backgroundColor: Colors.casinoBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  noticeIcon: {
    height: 20,
    width: 20,
  },
  noticeWrapper: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
  },
  noticeText: {
    color: 'darkorange',
    fontSize: 13,
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
  entryList: {
    flex: 1
  },
  entry: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: ENTRY_HEIGHT,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  entryLeft: {
    width: ENTRY_HEIGHT,
    alignItems: 'center', 
  },
  entryRight: {
    flex: 1
  },
  entryImage: {
    width: ENTRY_HEIGHT/2,
    height: ENTRY_HEIGHT/2,
  },
  entryTitle: {
    ...Fonts.style.h5,
    color: Colors.activeTint,
    fontWeight: 'bold',
    padding: 3
  },
  entryDesc: {
    fontSize: 14,
    color: Colors.text,
    padding: 3
  },
})
