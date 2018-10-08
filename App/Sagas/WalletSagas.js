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
import abi from '../Config/abi'
import walletLib from '../Lib/Wallet/wallet'
import ConfirmModalActions, { ConfirmModalSelectors } from '../Redux/ConfirmModalRedux';

// import { WalletSelectors } from '../Redux/WalletRedux'
let ethers = require('ethers')
let axios = require('axios')

//随机生成一个wallet，将wallet对象返回
export function* newWallet(api, action) {
  console.tron.log('newWallet begin')
  const wallet = yield call(ethers.Wallet.RNCreateRandom)
  console.tron.log('newWallet', wallet)
  yield put(WalletActions.setWallet(wallet))
}

//新建wallet后，将wallet存入本地存储中
export function* saveWallet(api, action) {
  let { mnemonic, password } = action.data
  console.tron.log('saveWallet begin', action)
  yield call(walletLib.importMnemonic, mnemonic, password)
  console.tron.log('saveWallet success')
  // yield put(WalletActions.setWallet(wallet))
}


//从本地存储中读入wallet数据，将其存入到全局变量W中
export function* initWallet(api, action) {

  yield call(walletLib.initWallet)
  // const delay = (ms) => new Promise(res => setTimeout(res, ms))
  yield socket.emit('lottery', W.address)
  //yield call(delay, 1000)
  // yield delay(5000)
}

// 从助记词导入钱包，并将其存入本地存储中
export function* importFromMnemonic(api, action) {
  let { mnemonic, password } = action.data
  yield call(walletLib.importMnemonic, mnemonic, password)
}

// 从keystore导入钱包，并将其存入本地存储中
export function* importEncryptWallet(api, action) {
  console.log('wallet importEncryptWallet', action)
  var { keystore, password } = action.data

  yield call(walletLib.importKeyStore, keystore, password)

}

// 输入密码解锁当前钱包
export function* unlockWallet(api, action) {
  let { password } = action.data
  let result = yield call(walletLib.unlockWallet, password)
  console.tron.log('unlock wallet', result)

}


// 当前钱包, 并将其keystore返回给前端
export function* encryptWallet(api, action) {


  let { successActions } = action.data
  let password = yield select(PwdModalSelectors.getPassword)

  let result = yield call(walletLib.unlockWallet, password)
  if (!result) {
    yield put(PwdModalActions.setErrInfo({ errInfo: 'wrong password' }))
    return

  } else {
    yield put(PwdModalActions.closePwdModal())

    if(successActions){
      for(var successAction of successActions){
        console.tron.log('successActions', successAction)
        yield put(successAction.action(successAction.data))
      }
    }
  }

  const keystore = yield call(walletLib.encryptWallet, W.wallet, password)
  yield put(WalletActions.setKeystore(keystore))
}


export function* transfer(api, action) {

  let { to, value, options } = action.data
  let password = yield select(PwdModalSelectors.getPassword)


  let result = yield call(walletLib.unlockWallet, password)
  if (!result) {
    yield put(PwdModalActions.setErrInfo({ errInfo: 'wrong password' }))
    return
  } else {
    yield put(PwdModalActions.closePwdModal())
  }

  if (W.wallet) {
    let txHash = yield call(walletLib.sendTx, W.wallet, to, value, options);
    console.tron.log('setTx', txHash)
    yield put(WalletActions.setTx(txHash))
  }
}


//获取当前账户的以太坊余额
export function* getBlance(api, action) {
  let balance = yield call(walletLib.getBalance, W.address)
  yield put(WalletActions.setBalance(balance))
}

//下注--获取随机数
export function* getRandom(api, action) {
  let { address } = action.data
  const data = {
    'address': address,
    'network_id': '1'
  }
  const response = yield call(api.getRandom, data)
  if (response.ok) {

    console.tron.log('getRandom Res', response.data)
    yield put(WalletActions.walletSuccess(response.data))
    yield put(ConfirmModalActions.confirmModalSuccess({ gas: response.data.gasPrice/ 1e9 }))

  } else {
    yield put(WalletActions.walletFailure({gasPrice: 4e9, secret: {}}))
    yield put(ConfirmModalActions.confirmModalSuccess({ gas: 4 }))
  }
}

//下注--提交区块链
export function* placeBet(api, action) {

  var { betMask, modulo, value} = action.data
  let secret = yield select(WalletSelectors.getSecret)
  let gasPrice = (yield select(ConfirmModalSelectors.getGas)) * 1e9
  let password = yield select(PwdModalSelectors.getPassword)

  console.tron.log('placeBet secret', secret, gasPrice)

  if (!W.wallet) {
    let result = yield call(walletLib.unlockWallet, password)

    if (!result) {
      yield put(PwdModalActions.openPwdModal({
        submitedActions: [
          {
            action: WalletActions.placeBet,
            data: { betMask, modulo, value }
          }
        ]
      }))

      yield put(PwdModalActions.setErrInfo({ errInfo: 'wrong password' }))
      return
    }
    yield put(PwdModalActions.closePwdModal())
  }

  const wallet = W.wallet
  wallet.provider = ethers.providers.getDefaultProvider(W.network)

  console.tron.log('res2', wallet)

  var contractAddress = '0x3d392560290a746542Cb14429E9ED2898aa74464'
  var contract = new ethers.Contract(contractAddress, abi, wallet)
  var overrideOptions = {
    value: ethers.utils.parseEther(value),
    gasPrice: parseInt(gasPrice)
  }

  console.tron.log('res3', action.data, overrideOptions)

  let ans = yield contract.placeBet(betMask, modulo, secret.commitLastBlock, secret.commit,
    secret.signature.r, secret.signature.s, overrideOptions)
  console.tron.log('ans', ans)


  yield put(GameActions.updateStatus({[modulo]: 'place'}))


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
