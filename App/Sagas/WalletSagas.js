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
import walletLib from '../Lib/Wallet/wallet'
import ConfirmModalActions, { ConfirmModalSelectors } from '../Redux/ConfirmModalRedux'
import { ConfigSelectors } from '../Redux/ConfigRedux'
import NavigationActions from 'react-navigation/src/NavigationActions'

// import { WalletSelectors } from '../Redux/WalletRedux'
let ethers = require('ethers')
let axios = require('axios')

function * postNewWallet () {

  yield socket.emit('lottery', W.address)
  yield put(NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'BottomTab',
        action: NavigationActions.navigate({ routeName: 'Wallet' })
      }),
    ]
  }))
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
  !!W.keystoreInitialized && (yield socket.emit('lottery', W.address))
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
    alert('wrong mnemonic')
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
    alert('wrong password')
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
    yield put(WalletActions.setTx(txHash))
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
  let gasPrice = (yield select(ConfirmModalSelectors.getGas)) * 1e9
  let password = yield select(PwdModalSelectors.getPassword)
  let config = yield select(ConfigSelectors.getConfig)

  let {contract_address, abi} = config

  console.tron.log('placeBet secret', secret, gasPrice)

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

  yield put(GameActions.updateStatus({[modulo]:'placing'}))

  const wallet = W.wallet

  console.tron.log('res2', wallet)

  let contract = new ethers.Contract(contract_address, abi, wallet)
  let overrideOptions = {
    value: ethers.utils.parseEther(value),
    gasPrice: parseInt(gasPrice)
  }

  console.tron.log('res3', action.data, overrideOptions)

  let ans = yield contract.placeBet(betMask, modulo, secret.commitLastBlock, secret.commit,
    secret.signature.r, secret.signature.s, overrideOptions)
  console.tron.log('ans', ans)
  if(!!ans && !!ans.hash){
    yield call(api.commitTx, {commit: secret.commit, tx_hash: ans.hash})
  }

  yield put(GameActions.updateStatus({[modulo]: 'placed'}))

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
