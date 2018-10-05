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

import { call, put} from 'redux-saga/effects'
import WalletActions from '../Redux/WalletRedux'
import AppConfig from '../Config/AppConfig'
import abi from '../Config/abi'
import walletLib from '../Lib/Wallet/wallet'

// import { WalletSelectors } from '../Redux/WalletRedux'
let ethers = require('ethers')
let axios = require('axios')

//随机生成一个wallet，将wallet对象返回
export function * newWallet (api, action) {
  console.tron.log('newWallet begin')
  const wallet = yield call(ethers.Wallet.RNCreateRandom)
  console.tron.log('newWallet', wallet)
  yield put(WalletActions.setWallet(wallet))
}

//新建wallet后，将wallet存入本地存储中
export function * saveWallet (api, action) {
  console.tron.log('saveWallet begin', action)
  yield call(walletLib.importMnemonic, action.data.mnemonic, action.data.password)
  console.tron.log('saveWallet success')
  // yield put(WalletActions.setWallet(wallet))
}


//从本地存储中读入wallet数据，将其存入到全局变量W中
export function * initWallet (api, action) {

  yield call(walletLib.initWallet)
  // const delay = (ms) => new Promise(res => setTimeout(res, ms))
  yield socket.emit('lottery', W.address)
  //yield call(delay, 1000)
  // yield delay(5000)
}

// 从助记词导入钱包，并将其存入本地存储中
export function * importFromMnemonic(api, action) {
    yield call(walletLib.importMnemonic, action.data.mnemonic, action.data.password)
}

// 从keystore导入钱包，并将其存入本地存储中
export function * importEncryptWallet (api, action) {
  console.log('wallet importEncryptWallet', action)
  var keystore = action.data.keystore
  var pwd = action.data.password

  yield call(walletLib.importKeyStore, keystore, pwd)

}

// 输入密码解锁当前钱包
export function * unlockWallet(api, action){
  yield call(walletLib.unlockWallet, action.data.password)
}


// 当前钱包, 并将其keystore返回给前端
export function * encryptWallet (api, action) {
  const keystore = yield call(walletLib.encryptWallet, W.wallet)
  yield put(WalletActions.setKeystore(keystore))
}


export function * transfer (api, action) {

  let txHash = yield call(walletLib.sendTx, W.wallet, action.data.to, action.data.value, action.data.options);

  console.tron.log('setTx', txHash)
  yield put(WalletActions.setTx(txHash))
}



//获取当前账户的以太坊余额
export function * getBlance (api, action) {
  let balance = yield call(walletLib.getBalance, W.address)
  yield put(WalletActions.setBalance(balance))
}

//下注
export function * getRandom (api, action) {
  console.tron.log('action', action)
  var url = 'http://api.eth4.fun:7001/api/v1/games/dev/random'
  const res = yield axios.put(url, {
    'address': action.data.address,
    'network_id': '1'
  })
  console.tron.log('res', res)
  const wallet = W.wallet
  wallet.provider = ethers.providers.getDefaultProvider(W.network)


  console.tron.log('res2', wallet)

  var contractAddress = '0x3d392560290a746542Cb14429E9ED2898aa74464'
  var contract = new ethers.Contract(contractAddress, abi, wallet)
  var overrideOptions = {
    value: ethers.utils.parseEther(action.data.value),
    gasPrice: parseInt(res.data.gasPrice)
  }


  console.tron.log('res3', action.data, overrideOptions)
  let ans = yield contract.placeBet(action.data.betMask, action.data.modulo, res.data.secret.commitLastBlock, res.data.secret.commit,
    res.data.secret.signature.r, res.data.secret.signature.s, overrideOptions)
  console.tron.log('ans', ans)
}

//获取当前钱包信息
export function* getWallet(api, action) {
  const { data } = action
  try {
    let balance = yield call(walletLib.getBalance, W.address)
    console.tron.log('getWallet', balance)
    yield put(WalletActions.walletSuccess({ address: W.address, balance: balance }))

  } catch (err) {
    yield put(WalletActions.walletFailure())
  }
}
