import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  oneDiceBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#2C3658'
  },
  oneDiceItem: {
    width: 50, height: 50
  },
  infoBox: {
    flex: 1, alignSelf: 'center'
  },
  infoText: {
    color: '#fff', fontSize: 20
  },
})
