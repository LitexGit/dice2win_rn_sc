'use strict'

// import React, { Component } from 'react'

//const CryptoJS = require('crypto-js')
const ethers = require('ethers')
import RNFS from 'react-native-fs';
import { Wallet, providers, utils } from 'ethers'



function initGlobalW(keystore){
  W.address = ethers.utils.getAddress(keystore.address);
  W.keystore = keystore;
  W.keystoreInitialized = true;
}

function initGlobalWFull(wallet){
  W.wallet = wallet;
  W.address = ethers.utils.getAddress(wallet.address);
}


/**
 * 将钱包存储到本地的文件中
 *
 * @param wallet    [钱包对象]
 * @param password  [钱包密码]
 * @param filepath  [钱包密码]
 *
 * @return {boolean}
 */
async function saveKeyStore(wallet, password, filepath) {
  let json = await wallet.RNencrypt(password, {scrypt:{N:4096}})
  // let json = await wallet.RNencrypt(password)
  console.tron.log('walletLib saveKeyStore', json)
  let result = await RNFS.writeFile(filepath, json, 'utf8')
  console.tron.log('walletLib saveKeyStore writeFile', result)
  return json

}


/**
 * 导出钱包到keystore
 *
 * @param  wallet 钱包对象
 * @param  password 钱包密码
 *
 * @returns {string} keystore对应的json
 */
async function encryptWallet(wallet, password){

  let json = await wallet.RNencrypt(password, {scrypt: {N: 1 << 15}})
  console.tron.log('walletLib encrypt wallet', json)
  return json
}




/**
 * 根据 私钥 恢复钱包
 *
 * @param privatekey [私钥]
 *
 * @returns {ethers.Wallet}
 */
async function importPrivateKey(privatekey, password) {
  let wallet = new Wallet(privatekey)
  initGlobalWFull(wallet)
  saveKeyStore(wallet, password, W.keystorePath)
}

/**
 * 根据 KeyStore 恢复钱包
 *
 * @param keystore    [JSON 字符串]
 * @param password    [钱包密码]
 *
 * @returns {boolean}
 */
async function importKeyStore(keystore, password) {
  var json = JSON.stringify(keystore)
  let wallet = null
  console.tron.log('walletLib importKeystore params', keystore, password)
  try {
    wallet = await Wallet.RNfromEncryptedWallet(json, password)

    console.tron.log('walletLib importKeystore', wallet)

    let keystore1 = saveKeyStore(wallet, password, W.keystorePath)

    console.tron.log('walletLib importKeystore keystore', keystore1)
    initGlobalW(keystore1)
    initGlobalWFull(wallet)

    console.tron.log('walletLib importKeystore W', W)
  } catch (err) {
    console.tron.log('walletLib importKeystore err', err)
  }

  return wallet;

}

/**
 * 通过 助记词 恢复钱包
 *
 * @param walletData  [加密过的 钱包数据]
 * @param password [PIN 码]
 *
 * @returns {boolean}
 */
async function importMnemonic(mnemonic, password) {

  let wallet = null
  try {
    let wallet = await Wallet.RNFromMnemonic(mnemonic)

    console.tron.log('walletLib importMnemonic', wallet)

    let keystore = await saveKeyStore(wallet, password, W.keystorePath)

    console.tron.log('walletLib importMnemonic keystore', keystore)

    initGlobalW(JSON.parse(keystore))
    initGlobalWFull(wallet)

    console.tron.log('walletLib importMnemonic W', W)
  } catch (err) {

    console.tron.log('walletLib importKeystore err', err)
  }

  return wallet

}

/**
 * 随机生成钱包 (附带随机自助词)
 *
 * @return {wallet}
 */
async function createWallet() {
  return await ethers.Wallet.RNCreateRandom()
}

/**
 * 获取钱包余额
 *
 * @param wallet [ETH 钱包对象]
 */
async function getBalance(address) {
  var balance = 0
  let provider = providers.getDefaultProvider(W.network)
  var balanceRaw = await provider.getBalance(address)
  var balance = parseInt(balanceRaw) / 1e18
  return balance
}

/**
 * 发送交易
 *
 * @param fromWallet [要付款的钱包对象]
 * @param toAddress  [收款地址]
 * @param value      [金额]
 *
 * @return string txHash 交易哈希
 */
async function sendTx(wallet, toAddress, value, options) {

  wallet.provider = providers.getDefaultProvider(W.network)
  let defaultOptions = {
    gasLimit: 21000,
    gasPrice: 3e9
  }
  let amount = utils.parseEther(value)
  defaultOptions  = Object.assign(defaultOptions, options)
  let txHash = await wallet.send(toAddress, amount, defaultOptions)
  return txHash

}

/**
 * 从本地存储载入钱包初始化
 * 并对global.W进行初始化
 *
 * @return null
 */
async function initWallet() {
  const keystorePath = RNFS.DocumentDirectoryPath + '/keystore.json'

  // if keystore file not exist, create a fake file
  // await createFakeWallet(keystorePath)

  if (!W) {
    W = { network: 'ropsten', keystorePath: keystorePath };
    // load keystore from keystorePath
    try {
      let keystore = await RNFS.readFile(keystorePath);
      console.tron.log('initWallet', keystore);
      initGlobalW(JSON.parse(keystore))

    } catch (err) {
      console.tron.log('initWallet', err);
      W.keystoreInitialized = false;
    }
  }
  // await unlockWallet('123')

}

async function createFakeWallet(keystorePath){
  try {
    let exist = await RNFS.exists(keystorePath);
    // let exist = false;
    if (!exist) {
      let json = '{"address":"fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","id":"d64a43b1-06de-468d-bc06-e6b39d515428","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"cdb19e71fcf868c842bf6c2a4006e0bb"},"ciphertext":"05cfe364bfb847ec9f27fd99f7dc4e30a4d58a2560ede52aef70d5c149b4635c","kdf":"scrypt","kdfparams":{"salt":"c9197a9b3ef9447e2c9b178cb8c0e9932ba7822002f08a06d85ecb8fc0c6c903","n":4096,"dklen":32,"p":1,"r":8},"mac":"a500e9ffd2b49794633dc5e846d6ef9856aea30de2095599b1db526cb964f028"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-10-01T09-31-29.0Z--fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","mnemonicCounter":"7fec53a97319ebff9a671eeef9e25c3b","mnemonicCiphertext":"8f88352567bbb001cb64936f84d5721b","version":"0.1"}}';
      // let json = '{"address":"fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","id":"633246eb-18f3-4492-a6a4-bcac6d416306","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"167c8308417951a0cc5fd3fa53ce3c07"},"ciphertext":"b714decc1fab39ddca1748ce34f6c823006bbdfa1de3ddc64912e26db98ce49d","kdf":"scrypt","kdfparams":{"salt":"844142f3e9618d62f59b253766edf55f29e96b088f18f35767a8ee4b50e8d2c3","n":131072,"dklen":32,"p":1,"r":8},"mac":"004001adba97970b56c678bc579f47526b2c2b9a6a2127b4a23dfc79d1f97cf7"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-09-29T03-09-28.0Z--fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","mnemonicCounter":"ae63b34eb14407f942541d511a9dfccb","mnemonicCiphertext":"4b6fdef7b4ae9ba363144a61ebe1070b","version":"0.1"}}';
      let result = await RNFS.writeFile(keystorePath, json, 'utf8');
      // console.tron.log(result);
    }
  } catch (err) {
    console.tron.log('write file err', err)
    console.log('write file err', err)
  }
}

async function unlockWallet(password){
    try {
      let wallet = await Wallet.RNfromEncryptedWallet(JSON.stringify(W.keystore), password);

      initGlobalWFull(wallet);
      console.tron.log('wallet decrypted', W);
      return true
    } catch (err) {
      console.tron.log('wallet decrypted err', err);
      return false
    }
}



module.exports = {
  importPrivateKey,
  importKeyStore,
  importMnemonic,
  createWallet,
  getBalance,
  sendTx,
  saveKeyStore,
  initWallet,
  unlockWallet
}
