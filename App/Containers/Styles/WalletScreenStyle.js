import { StyleSheet } from 'react-native'
import { Colors, Fonts, ApplicationStyles } from '../../Themes/'

const BUTTON_SIZE = 80

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  walletWrapper:{
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletEditWrapper:{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  walletButton: {
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  walletIcon:{
    color: 'gray',
  },
  walletText: {
    color: 'gray',
  },
  balanceWrapper:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  balance:{
    ...Fonts.style.h2,
    color: Colors.activeTint,
  },
  unit: {
    fontSize: 16,
    color: Colors.text,
  },
  
  qr:{
    margin:10,
    padding: 1,
    backgroundColor: Colors.steel,
  },

  addressWrapper:{
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,

    alignItems: 'center',

    margin: 10,
    borderRadius: 5,
    backgroundColor: Colors.cloud
  },
  addressText:{
    fontSize: 13,
    color: Colors.text
  },

  shareWrapper:{
    flex: 1,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: Colors.facebook,
  },
  shareUp:{
    flex: 1,
    padding:10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.casinoBlue,
  },
  bonusBalanceWrapper:{
    marginTop: 5,
  },
  bonusDetailWrapper:{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  shareDown:{
    flex: 1,
    padding: 10,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: {
    ...Fonts.style.h5,
    color: Colors.snow,
  },
  codeWrapper:{
    flex: 1,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  actionsWrapper:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  actionWrapper:{
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.steel,
  },
  action:{
    fontSize: 16,
    color: Colors.casinoBlue,
  },


  bonus: {
    ...Fonts.style.h4,
    color: Colors.bloodOrange,
  },


  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex:1,
    height: BUTTON_SIZE,
    borderColor: Colors.facebook,
    borderWidth: 1,
    borderTopWidth:0,
    borderLeftWidth:0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...Fonts.style.normal,
    color: Colors.ricePaper,
    fontWeight: 'bold',
  }
})
