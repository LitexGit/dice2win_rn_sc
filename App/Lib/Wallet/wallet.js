'use strict'

// import React, { Component } from 'react'

//const CryptoJS = require('crypto-js')
const ethers = require('ethers')
import RNFS from 'react-native-fs';
import { Wallet, providers, utils } from 'ethers'

function getFallbackProvider(network){

  var infuraProvider = new providers.InfuraProvider(network);
  var etherscanProvider = new providers.EtherscanProvider(network);
  var fallbackProvider = new providers.FallbackProvider([
    infuraProvider,
    etherscanProvider
  ]);
  return fallbackProvider;
}

function initGlobalW(keystore){
  W.address = ethers.utils.getAddress(keystore.address);
  W.keystore = keystore;
  W.keystoreInitialized = true;
}

function initGlobalWFull(wallet){
  W.wallet = wallet;
  W.address = ethers.utils.getAddress(wallet.address);


  W.wallet.provider = getFallbackProvider(W.network)

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

  initGlobalW(JSON.parse(json))
  initGlobalWFull(wallet)
  console.tron.log('walletLib importKeystore W', W)




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
  await saveKeyStore(wallet, password, W.keystorePath)
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
  let json = JSON.stringify(keystore)
  console.tron.log('walletLib importKeystore params', json, password)
  try {
    let wallet = await Wallet.RNfromEncryptedWallet(json, password)

    console.tron.log('walletLib importKeystore', wallet)

    let keystore1 = await saveKeyStore(wallet, password, W.keystorePath)


    return wallet
  } catch (err) {
    console.tron.log('walletLib importKeystore err', err)
    return null
  }


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

  try {
    let wallet = await Wallet.RNFromMnemonic(mnemonic)

    console.tron.log('walletLib importMnemonic', wallet)

    let keystore = await saveKeyStore(wallet, password, W.keystorePath)

    return wallet

  } catch (err) {

    console.tron.log('walletLib importKeystore err', err)
    return null
  }


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
  let balance = 0
  // let provider = providers.getDefaultProvider(W.network)

  let provider = getFallbackProvider(W.network)
  let balanceRaw = await provider.getBalance(address)
  balance = parseInt(balanceRaw) / 1e18
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

  try {
    let defaultOptions = {
      // gasLimit: 21000,
      gasPrice: 3e9
    }
    let amount = utils.parseEther(value)
    defaultOptions = Object.assign(defaultOptions, options)
    console.tron.log('sendTx defaultOptions', defaultOptions)
    let txHash = await wallet.send(toAddress, amount, defaultOptions)
    return txHash
  } catch (err) {
    return null;
  }

}



async function placeBet(wallet, contractInfo, params, value, gasPrice) {

  let { contract_address, abi } = contractInfo
  let { betMask, modulo, secret } = params


  let contract = new ethers.Contract(contract_address, abi, wallet)
  let overrideOptions = {
    value: ethers.utils.parseEther(value + ''),
    gasPrice: parseInt(gasPrice)
  }

  console.tron.log('res3', params, overrideOptions)

  try {

    let ans = await contract.placeBet(betMask, modulo, secret.commitLastBlock, secret.commit,
      secret.signature.r, secret.signature.s, overrideOptions)

    console.tron.log('ans', ans)

    return ans
  } catch (err) {
    return null
  }
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

  W.keystorePath = keystorePath;
  // load keystore from keystorePath
  try {
    let keystore = await RNFS.readFile(keystorePath);
    console.tron.log('initWallet', keystore);
    initGlobalW(JSON.parse(keystore))

  } catch (err) {
    console.tron.log('initWallet', err);
    W.keystoreInitialized = false;
  }
  // await unlockWallet('123')

}

async function createFakeWallet(keystorePath){
  try {
    let exist = await RNFS.exists(keystorePath);
    // let exist = false;
    if (!exist) {
      let json = '{"address":"56d77fcb5e4fd52193805ebadef7a9d75325bdc0","crypto":{"cipher":"aes-128-ctr","ciphertext":"5982011c63bfd6a666b464f861cbc8635952bf4fd18069f4f223a41a56525171","cipherparams":{"iv":"05afca29e82a8cb40c9b48bec60611eb"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"46c8169fdcc3bfa46944c92f8c3964bf209a7c4f3589842064be7cdf8422c8cf"},"mac":"103b428a84ffef38fd49680d17589e3806ea6868d8504eb2e406217925be2c1a"},"id":"040d2a89-cf8f-4965-9ebb-748639435ea3","version":3}';
      // let json = '{"address":"fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","id":"633246eb-18f3-4492-a6a4-bcac6d416306","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"167c8308417951a0cc5fd3fa53ce3c07"},"ciphertext":"b714decc1fab39ddca1748ce34f6c823006bbdfa1de3ddc64912e26db98ce49d","kdf":"scrypt","kdfparams":{"salt":"844142f3e9618d62f59b253766edf55f29e96b088f18f35767a8ee4b50e8d2c3","n":131072,"dklen":32,"p":1,"r":8},"mac":"004001adba97970b56c678bc579f47526b2c2b9a6a2127b4a23dfc79d1f97cf7"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-09-29T03-09-28.0Z--fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","mnemonicCounter":"ae63b34eb14407f942541d511a9dfccb","mnemonicCiphertext":"4b6fdef7b4ae9ba363144a61ebe1070b","version":"0.1"}}';
      let result = await RNFS.writeFile(keystorePath, json, 'utf8');
      // console.tron.log(result);
    }
  } catch (err) {
    console.tron.log('write file err', err)
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
  placeBet,
  saveKeyStore,
  initWallet,
  unlockWallet,
  encryptWallet
}
