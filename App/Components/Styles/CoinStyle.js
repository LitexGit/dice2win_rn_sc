import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  coinBox: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#2C3658'
  },
  coinItem: {
    width: 100, height: 100
  },
  infoBox: {
    flex: 1, alignSelf: 'center'
  },
  infoText: {
    color: '#fff', fontSize: 20
  },
})
