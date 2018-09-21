import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes'
import Colors from '../../Themes/Colors'

const ENTRY_HEIGHT = 100
export default StyleSheet.create({
  ...ApplicationStyles.screen,

  swiper:{
    height: 180,
  },
  slide: {
    height: 180,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    flex:1,
    height: 180,
    backgroundColor: 'transparent'
  },

  entryList: {
    flex: 1
  },
  entry: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: ENTRY_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: Colors.cloud,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cloud
  },
  entryLeft: {
    width: ENTRY_HEIGHT
  },
  entryRight: {
    flex: 1
  },
  entryImage: {
    width: ENTRY_HEIGHT,
    height: ENTRY_HEIGHT,
  },
  entryTitle: {
    fontSize: 24,
    color: Colors.banner,
  },
  entryDesc: {
    fontSize: 14,
    color: Colors.facebook
  },
})
