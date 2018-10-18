/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put, select } from 'redux-saga/effects'
import WalletActions, { WalletSelectors } from '../Redux/WalletRedux'
import GameActions from '../Redux/GameRedux'
import PwdModalActions, { PwdModalSelectors } from '../Redux/PwdModalRedux'
import MessageBoxActions from '../Redux/MessageBoxRedux'
import walletLib from '../Lib/Wallet/wallet'
import ConfirmModalActions, { ConfirmModalSelectors } from '../Redux/ConfirmModalRedux'
import { ConfigSelectors } from '../Redux/ConfigRedux'
import NavigationActions from 'react-navigation/src/NavigationActions'
import Toast from 'react-native-root-toast'
import JPushModule from 'jpush-react-native'
import { Alert } from 'react-native'

import UserActions from '../Redux/UserRedux'

// import { WalletSelectors } from '../Redux/WalletRedux'
let ethers = require('ethers')
let axios = require('axios')

let setAlias = (alias) => {
  return new Promise((resolve, reject) => {
    JPushModule.setAlias(alias, map => {
      if (map.errorCode === 0) {
        console.tron.log('jpush set alias succeed')
        resolve(true)
      } else {
        console.tron.log('jpush set alias failed, errorCode: ' + map.errorCode)
        reject(map.errorCode)
      }
    })
  })
}


function * postNewWallet () {

  yield socket.emit('lottery', W.address)

  let resetData = {
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'BottomTab',
        action: NavigationActions.navigate({routeName: 'Wallet'})
      }),
    ]
  }

  // 钱包更换之后, 重新注册
  yield put(UserActions.register({address: W.address, inviter: '', nickname: ''}))

  yield put(MessageBoxActions.openMessageBox({
    title: 'Info',
    message: 'Wallet create success!\n\nTo play, you need to transfer ETH to your new wallet address',
    submitedActions: [{ action: WalletActions.navigateToBottomTab, data: { routeName: 'Wallet' } }]
  }))

  yield setAlias(W.address.substr(2))
}


// 自动导航到主页的某个Tab
export function * navigateToBottomTab(api, action){

  let { routeName } = action.data
  let resetData = {
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'BottomTab',
        action: NavigationActions.navigate({ routeName })
      }),
    ]
  }

  yield put(NavigationActions.reset(resetData))


}

// 随机生成一个wallet，将wallet对象返回
export function * newWallet (api, action) {
  console.tron.log('newWallet begin')
  const wallet = yield call(ethers.Wallet.RNCreateRandom)
  console.tron.log('newWallet', wallet)
  yield put(WalletActions.setWallet(wallet))
}

// 新建wallet后，将wallet存入本地存储中
export function * saveWallet (api, action) {
  let {mnemonic, password} = action.data
  console.tron.log('saveWallet begin', action)
  yield call(walletLib.importMnemonic, mnemonic, password)
  console.tron.log('saveWallet success')

  yield postNewWallet()
}

// 从本地存储中读入wallet数据，将其存入到全局变量W中
export function * initWallet (api, action) {

  yield call(walletLib.initWallet)
  let config = yield select(ConfigSelectors.getConfig)

  W.network = config.network

  // const delay = (ms) => new Promise(res => setTimeout(res, ms))
  if (!!W.keystoreInitialized) {

    !!socket && (yield socket.emit('lottery', W.address))

    yield setAlias(W.address.substr(2))

  }
  // yield call(delay, 1000)
  // yield delay(5000)
}

// 从助记词导入钱包，并将其存入本地存储中
export function * importFromMnemonic (api, action) {
  let {mnemonic, password} = action.data
  let wallet = yield call(walletLib.importMnemonic, mnemonic, password)
  if (!!wallet) {
    yield postNewWallet()
  } else {

    yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: 'wrong mnemonic' }))
    // Alert.alert('Warning', 'wrong mnemonic', [{ text: 'OK' },], { cancelable: false })
  }
}

// 从keystore导入钱包，并将其存入本地存储中
export function * importEncryptWallet (api, action) {
  console.tron.log('wallet importEncryptWallet', action)
  let {keystore, password} = action.data

  let wallet = yield call(walletLib.importKeyStore, keystore, password)
  if (!!wallet) {
    yield postNewWallet()
  } else {
    yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: 'wrong password' }))
    // Alert.alert('Warning', 'wrong password', [{ text: 'OK' },], { cancelable: false })
  }

}

// 输入密码解锁当前钱包
export function * unlockWallet (api, action) {
  let {password} = action.data
  let result = yield call(walletLib.unlockWallet, password)
  console.tron.log('unlock wallet', result)

}

// 当前钱包, 并将其keystore返回给前端
export function * encryptWallet (api, action) {

  let {successActions} = action.data
  let password = yield select(PwdModalSelectors.getPassword)

  let result = yield call(walletLib.unlockWallet, password)
  if (!result) {
    yield put(PwdModalActions.setErrInfo({errInfo: 'wrong password'}))
    return

  } else {
    yield put(PwdModalActions.closePwdModal())

    if (successActions) {
      for (let successAction of successActions) {
        console.tron.log('successActions', successAction)
        yield put(successAction.action(successAction.data))
      }
    }
  }

  const keystore = yield call(walletLib.encryptWallet, W.wallet, password)
  yield put(WalletActions.setKeystore(keystore))
}

//转账
export function * transfer (api, action) {

  let {to, value} = action.data
  let password = yield select(PwdModalSelectors.getPassword)
  let gasPrice = (yield select(ConfirmModalSelectors.getGas)) * 1e9
  let options = {gasPrice}

  let result = yield call(walletLib.unlockWallet, password)
  if (!result) {
    yield put(PwdModalActions.setErrInfo({errInfo: 'wrong password'}))
    return
  } else {
    yield put(PwdModalActions.closePwdModal())
  }

  if (W.wallet) {
    let txHash = yield call(walletLib.sendTx, W.wallet, to, value, options)
    console.tron.log('setTx', txHash)

    if (!txHash) {
      yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: 'Transfer too frequently, please try again later', }))
      return
    }

    yield put(WalletActions.setTx(txHash))
    yield put(MessageBoxActions.openMessageBox({
      title: 'Info',
      message: 'Transfer submit success!\n\nPlease check in Tab Records -> Transactions',
      submitedActions: [{ action: WalletActions.navigateToBottomTab, data: { routeName: 'Record' } }]
    }))
  } else {
    yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: 'transfer submit fail' }))
  }
}

//获取当前账户的以太坊余额
export function * getBlance (api, action) {
  let balance = yield call(walletLib.getBalance, W.address)
  yield put(WalletActions.setBalance(balance))
}

//下注--获取随机数
export function * getRandom (api, action) {
  let {address} = action.data
  const data = {
    'address': address,
    'network_id': '1'
  }
  yield put(WalletActions.walletRequest())

  const response = yield call(api.getRandom, data)
  if (response.ok) {

    console.tron.log('getRandom Res', response.data)
    yield put(WalletActions.walletSuccess(response.data))
    yield put(ConfirmModalActions.confirmModalSuccess({gasAuto: response.data.gasPrice / 1e9}))

  } else {
    yield put(WalletActions.walletFailure({gasPrice: 4e9, secret: {}}))
    yield put(ConfirmModalActions.confirmModalSuccess({gas: 4}))
  }
}

//下注--提交区块链
export function * placeBet (api, action) {

  let {betMask, modulo, value} = action.data
  let secret = yield select(WalletSelectors.getSecret)
  let walletR = yield select(WalletSelectors.getWallet)
  let gasPrice = (yield select(ConfirmModalSelectors.getGas)) * 1e9
  let password = yield select(PwdModalSelectors.getPassword)
  let config = yield select(ConfigSelectors.getConfig)

  let {contract_address, abi} = config
  let {fetching} = walletR

  console.tron.log('placeBet secret', secret, gasPrice)


  if(fetching || !secret.commit){
    yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: 'Server no response' }))
    return
  }

  if (!W.wallet) {
    let result = yield call(walletLib.unlockWallet, password)

    if (!result) {
      yield put(PwdModalActions.openPwdModal({
        submitedActions: [
          {
            action: WalletActions.placeBet,
            data: {betMask, modulo, value}
          }
        ]
      }))

      password = yield select(PwdModalSelectors.getPassword)
      if (!!password) {
        yield put(PwdModalActions.setErrInfo({errInfo: 'wrong password'}))
      }
      return
    }
    yield put(PwdModalActions.closePwdModal())
  }

  yield put(GameActions.updateStatus({[modulo]: 'placing'}))

  // const wallet = W.wallet

  // console.tron.log('res2', wallet)

  // let contract = new ethers.Contract(contract_address, abi, wallet)
  // let overrideOptions = {
  //   value: ethers.utils.parseEther(value+''),
  //   gasPrice: parseInt(gasPrice)
  // }

  // console.tron.log('res3', action.data, overrideOptions)

  // let ans = yield contract.placeBet(betMask, modulo, secret.commitLastBlock, secret.commit,
  //   secret.signature.r, secret.signature.s, overrideOptions)
  // console.tron.log('ans', ans)

  let ans = yield call(walletLib.placeBet, W.wallet, {contract_address, abi}, {
    betMask,
    modulo,
    secret
  }, value, gasPrice)

  if (!!ans && !!ans.hash) {
    yield call(api.commitTx, {commit: secret.commit, tx_hash: ans.hash})
    yield put(GameActions.updateStatus({ [modulo]: 'placed' }))
  } else {
    yield put(GameActions.updateStatus({ [modulo]: 'idle' }))
    yield put(MessageBoxActions.openMessageBox({ title: 'Warning', message: 'Place bet too frequently, please try again later' }))
  }

}

//获取当前钱包信息
export function * getWallet (api, action) {
  const {data} = action
  try {
    let balance = yield call(walletLib.getBalance, W.address)
    console.tron.log('getWallet', balance)
    yield put(WalletActions.walletSuccess({address: W.address, balance: balance}))

  } catch (err) {
    yield put(WalletActions.walletFailure())
  }
}
