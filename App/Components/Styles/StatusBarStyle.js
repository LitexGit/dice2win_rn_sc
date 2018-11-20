import { StyleSheet } from 'react-native'

export default StyleSheet.create({


  container: {
    height: 25,
    justifyContent:'center',
    textAlignVertical:'center',
    lineHeight:25,
  },

  channelStatusClosed: {
    color: '#000',
    backgroundColor: 'gray',
    fontSize: 12,
    padding: 5
  },

  channelStatusActive: {
    color: '#fff',
    backgroundColor: 'green',
    fontSize: 12,
    padding: 5
  }
})
