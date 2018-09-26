import { StyleSheet, Dimensions, Platform } from 'react-native'
// import { Colors, Metrics } from '../../Themes/'
import { ApplicationStyles } from '../../Themes'

const deviceHeight = Dimensions.get('window').height

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  gameContainer: {
    backgroundColor: '#2C3658',
    paddingTop: 30,
  },
  gameConetent: {
    padding: 20,
    height: deviceHeight - 300,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  stakeBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12
  },

  stakeButton: {
    backgroundColor: '#5F74AA'
  },
  stakeInput: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 30
  },
  balanceText: {
    color: '#fff', fontSize: 26
  },
  rewardText: {
    color: '#fff', fontSize: 16
  },
  logoContainer: {
    flex: 1,
    marginTop: deviceHeight / 8,
    marginBottom: 30
  },
  logo: {
    position: 'absolute',
    left: Platform.OS === 'android' ? 40 : 50,
    top: Platform.OS === 'android' ? 35 : 60,
    width: 280,
    height: 100
  },
  listBox: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12
  }
})
