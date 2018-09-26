import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  twoDiceBox: {
    flex: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#2C3658'
  },

  twoDiceItem: {
    width: 45, height: 45
  },
  infoBox: {
    flex: 1, alignSelf: 'center'
  },
  infoText: {
    color: '#fff', fontSize: 20
  },
})
