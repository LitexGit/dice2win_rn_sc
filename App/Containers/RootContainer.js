import React, { Component } from 'react'
import { View, StatusBar, Platform } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import NotificationActions from '../Redux/NotificationRedux'
import ConfigActions from '../Redux/ConfigRedux'
import ReduxPersist from '../Config/ReduxPersist'
import JPushModule from 'jpush-react-native'
import RNFS from 'react-native-fs';
import {Wallet} from 'ethers'


// Styles
import styles from './Styles/RootContainerStyles'

global.socket = null
global.W = null

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }

    if (Platform.OS === 'android') {
      JPushModule.initPush()
      // JPushModule.getInfo(map => {
        // this.setState({
        //   appkey: map.myAppKey,
        //   imei: map.myImei,
        //   package: map.myPackageName,
        //   deviceId: map.myDeviceId,
        //   version: map.myVersion
        // })
      // })
      JPushModule.notifyJSDidLoad(resultCode => {
        if (resultCode === 0) {
          JPushModule.addReceiveCustomMsgListener((message) => {
            console.tron.log('JPushMessageReceived: ', message)
            this.props.setNotification(message)
          })
        }
      })
    } else {
      JPushModule.setupPush()
    }
    this.props.initSocket(this.props.config.ws)
    // initWallet()
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
          <ReduxNavigation />
      </View>
    )
  }
}

const fakeWallet = async (path) =>{

  let json = '{"address":"fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","id":"633246eb-18f3-4492-a6a4-bcac6d416306","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"167c8308417951a0cc5fd3fa53ce3c07"},"ciphertext":"b714decc1fab39ddca1748ce34f6c823006bbdfa1de3ddc64912e26db98ce49d","kdf":"scrypt","kdfparams":{"salt":"844142f3e9618d62f59b253766edf55f29e96b088f18f35767a8ee4b50e8d2c3","n":131072,"dklen":32,"p":1,"r":8},"mac":"004001adba97970b56c678bc579f47526b2c2b9a6a2127b4a23dfc79d1f97cf7"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-09-29T03-09-28.0Z--fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","mnemonicCounter":"ae63b34eb14407f942541d511a9dfccb","mnemonicCiphertext":"4b6fdef7b4ae9ba363144a61ebe1070b","version":"0.1"}}';
  let result = await RNFS.writeFile(path, json, 'utf8');
  console.log(result);
}



const initWallet = async () => {
  const keystorePath = RNFS.MainBundlePath + '/keystore.json'

  // if keystore file not exist, create a fake file
  let exist = await RNFS.exists(keystorePath);
  if (!exist) {
    await fakeWallet(keystorePath);
  }

  if(!W){
    W = { network: 'ropsten' };
    // load keystore from keystorePath
    try {
      let keystore = await RNFS.readFile(keystorePath);
      console.log('initWallet', keystore);
      W.keystore = keystore;
      let keystoreObj = JSON.parse(keystore);
      W.address = keystoreObj.address;
      W.keystoreInitialized = true;
    } catch (err) {
      console.log('initWallet', err);
      W.keystoreInitialized = false;
    }


    //Decrypt keystore to wallet instance
    try {
      let wallet = await Wallet.RNfromEncryptedWallet(W.keystore, '123');
      W.wallet = wallet;
      console.log('wallet decrypted', W);
    } catch (err) {
      console.log('wallet decrypted err', err);
    }
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapStateToProps = (state) => ({
  config: state.config.payload
})

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  initSocket: (address) => dispatch(ConfigActions.socketInit(address)),
  setNotification: (message) => dispatch(NotificationActions.notificationSuccess({message: message}))
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
