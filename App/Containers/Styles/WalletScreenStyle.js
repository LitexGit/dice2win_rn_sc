import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  walletWrapper:{
    flex: 1,
    height: 250,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qr:{
  },
  addressWrapper:{
    padding: 7,
    margin: 10,
    borderRadius: 5,
    backgroundColor: Colors.cloud
  },
  addressText:{
    fontSize: 11,
    color: Colors.facebook
  }
})
