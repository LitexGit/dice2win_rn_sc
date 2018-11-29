import { StyleSheet, Dimensions, Platform } from 'react-native'
// import { Colors, Metrics } from '../../Themes/'
import { ApplicationStyles, Colors } from '../../Themes'

const deviceHeight = Dimensions.get('window').height
const STAKE_BOX_HEIGHT = 50
const STAKE_BUTTON_SIZE = 36
const START_BUTTON_SIZE = 48

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  gameContainer: {
    backgroundColor: Colors.casinoBlue,
  },
  gameConetent: {
    flex: 1,
    padding: 20,
  },
  stakeBox: {
    height: STAKE_BOX_HEIGHT,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  stakeButton: {
    height: STAKE_BUTTON_SIZE,
    width: STAKE_BUTTON_SIZE * 2,
    borderRadius: 5,
    backgroundColor: Colors.facebook,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stakeButtonText: {
    color: Colors.silver,
    fontSize: 16,
  },

  stakeInput: {
    flex: 1,
    textAlign: 'center',
    color: Colors.activeTint,
    fontSize: 26,
    marginLeft:10,
    marginRight:10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.facebook,
  },


  startButtonWrapper: {
    flex:1,
    alignItems: 'stretch',
    marginTop: 20,
  },
  startButton: {
    height: START_BUTTON_SIZE,
    borderRadius: 5,
    borderColor: Colors.bloodOrange,
    borderWidth: 1,
    backgroundColor: Colors.facebook,
    alignItems: 'center',
    justifyContent: 'center',
  },

  startButtonText: {
    color: Colors.silver,
    fontSize: 28,
  },

  balanceWrapper: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  balanceText: {
    color: 'goldenrod',
    fontSize: 16
  },

  rewardWrapper:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  keyText: {
    color: Colors.activeTint,
    fontSize: 20,
  },

  rewardText: {
    color: Colors.snow,
    fontSize: 14,
    padding: 3,
  },

  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    margin: 8,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neetGray,
  },
  tenSection:{
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  iconStyle:{
    marginRight: 8,
    color: '#999999'
  },
  tenText:{
    paddingTop: 4,
    color: '#999999'
  }
})
