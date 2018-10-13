import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '../../Themes';

const DICE_SIZE = 70

export default StyleSheet.create({
  oneDiceBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    paddingLeft: 32,
    paddingRight: 32,
  },
  oneDiceItem: {
    width: DICE_SIZE, height: DICE_SIZE
  },
  infoBox: {
    flex: 1,
    alignSelf: 'center',
    margin: 10,
  },
  infoText: {
    ...Fonts.style.h5,
    color: Colors.activeTint,
    textAlign: 'center',
  },
})
