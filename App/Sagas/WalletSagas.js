/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put } from 'redux-saga/effects'
import WalletActions from '../Redux/WalletRedux'
import AppConfig from '../Config/AppConfig'
import abi from '../Config/abi'
// import { WalletSelectors } from '../Redux/WalletRedux'
let ethers = require('ethers')
let axios = require('axios')

console.log('ethers', ethers)

export function * newWallet (api, action) {
  console.tron.log('newWallet begin')
  const wallet = yield call(ethers.Wallet.RNCreateRandom)
  console.tron.log('newWallet', wallet)
  AppConfig.wallet = wallet
  yield put(WalletActions.setWallet(wallet))
}

// 从助记词导入钱包
export function * importWallet (api, action) {

  const wallet = yield call(ethers.Wallet.fromMnemonic, action.mnemonic.mnemonic)
  AppConfig.wallet = wallet
}

// 从keystore导入钱包
export function * importEncryptWallet (api, action) {
  console.log('wallet importEncryptWallet', action)
  var json = JSON.stringify(action.data.keystore)
  var pwd = action.data.pwd
  let wallet = yield call(ethers.Wallet.RNfromEncryptedWallet, json, pwd)
  AppConfig.wallet = wallet
}

// 输入密码加密钱包出keystore存下
export function * encryptWallet (api, action) {
  const wallet = AppConfig.wallet
  const keystore = yield wallet.RNencrypt(action.data.pwd)
  yield put(WalletActions.setKeystore(keystore))
}

// 输入密码加密钱包出keystore存下
export function * transfer (api, action) {
  const wallet = AppConfig.wallet
  let amount = ethers.utils.parseEther(action.data.value)
  var provider = ethers.providers.getDefaultProvider(AppConfig.network)
  wallet.provider = provider
  let txHash = yield wallet.send(action.data.to, amount)
  console.tron.log('setTx', txHash)
  yield put(WalletActions.setTx(txHash))
}

export function * getBlance (api, action) {
  const wallet = AppConfig.wallet
  wallet.provider = ethers.providers.getDefaultProvider(AppConfig.network)
  var balanceRaw = yield wallet.getBalance()
  let balance = parseInt(balanceRaw) / 1e18
  yield put(WalletActions.setBalance(balance))
}

export function * getRandom (api, action) {
  console.tron.log('action', action)
  var url = 'http://api.eth4.fun:7001/api/v1/games/dev/random'
  const res = yield axios.put(url, {
    'address': action.data.address,
    'network_id': '1'
  })
  console.tron.log('res', res)
  const wallet = AppConfig.wallet
  wallet.provider = ethers.providers.getDefaultProvider(AppConfig.network)

  var contractAddress = '0xAe985667078744A8EFb0C6c0300D7861EF427148'
  var contract = new ethers.Contract(contractAddress, abi, wallet)
  var overrideOptions = {
    value: ethers.utils.parseEther(action.data.value)
  }

  let ans = yield contract.placeBet(action.data.betMask, action.data.modulo, res.data.secret.commitLastBlock, res.data.secret.commit,
    res.data.secret.signature.r, res.data.secret.signature.s, overrideOptions)
  console.tron.log('ans', ans)
}

export function * sendStake (api, action) {
  // const wallet = AppConfig.wallet
  // wallet.provider = ethers.providers.getDefaultProvider(AppConfig.network)
  //
  // var contractAddress = '0xAe985667078744A8EFb0C6c0300D7861EF427148'
  // var contract = new ethers.Contract(contractAddress, abi, wallet)
  // var overrideOptions = {
  //   value: ethers.utils.parseEther(action.data.value)
  // }
  // let res = yield contract.placeBet(action.data.betMask, action.data.modulo, action.data.commitLastBlock, action.data.commit, this.state.r, this.state.s, overrideOptions)
}

export function * getWallet (api, action) {
  const {data} = action
  // get current data from Store
  // const currentData = yield select(WalletSelectors.getData)
  // make the call to the api
  const response = yield call(api.getWallet, data)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(WalletActions.walletSuccess(response.data))
  } else {
    yield put(WalletActions.walletFailure())
  }
}
