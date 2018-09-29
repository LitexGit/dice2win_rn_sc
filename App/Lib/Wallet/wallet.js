'use strict'

// import React, { Component } from 'react'

//const CryptoJS = require('crypto-js')
const ethers = require('ethers')
import RNFS from 'react-native-fs';
import {Wallet, providers} from 'ethers'

module.exports = {
  // 初始化 余额
  balance: -1,
  // 初始化 交易哈希
  txHash: '',

  /**
   * 根据 私钥 恢复钱包
   *
   * @param privatekey [私钥]
   *
   * @returns {ethers.Wallet}
   */
  checkPrivateKey (privatekey) {
    (new ethers.Wallet(privatekey)).then(function (wallet) {
      return wallet
    })

    return false
  },

  /**
   * 根据 KeyStore 恢复钱包
   *
   * @param keystore    [JSON 字符串]
   * @param password    [钱包密码]
   *
   * @returns {boolean}
   */
  checkKeyStore (keystore, password) {
    var json = JSON.stringify(keystore)
    ethers.Wallet.RNfromEncryptedWallet(json, password).then(function (wallet) {
      return wallet
    })

    return false
  },

  /**
   * 通过 助记词 恢复钱包
   *
   * @param walletData  [加密过的 钱包数据]
   * @param pin         [PIN 码]
   *
   * @returns {boolean}
   */
  checkMnemonic (walletData, pin) {
    // var bytes = CryptoJS.AES.decrypt(walletData.mnemonicRaw, pin)
    // var mnemonic = bytes.toString(CryptoJS.enc.Utf8)
    // var wallet = ethers.Wallet.fromMnemonic(mnemonic)
    // if (wallet.address == walletData.address) {
    //   return wallet
    // }

    // return false
  },

  /**
   * 随机生成钱包 (附带随机自助词)
   *
   * @return {wallet}
   */
  createWallet () {
    return ethers.Wallet.createRandom()
  },

  /**
   * 获取钱包余额
   *
   * @param wallet [ETH 钱包对象]
   */
  getBalance: async (wallet) => {
    var balance = 0
    wallet.provider = providers.getDefaultProvider(W.network)
    var balanceRaw = await wallet.getBalance()
    var balance = parseInt(balanceRaw) / 1e18
    return balance
  },

  /**
   * 发送交易
   *
   * @param fromWallet [要付款的钱包对象]
   * @param toAddress  [收款地址]
   * @param value      [金额]
   *
   * @return string txHash 交易哈希
   */
  sendTx (fromWallet, toAddress, value) {
    var amount = ethers.utils.parseEther(value)
    var wallet = fromWallet
    wallet.provider = ethers.providers.getDefaultProvider('ropsten')
    var sendPromise = wallet.send(toAddress, amount)
    sendPromise.then(transactionHash => {
      var txHash = transactionHash.hash
      console.log('txHash', txHash)
      return txHash
    }).catch(arg => {
      alert('交易失败！原因是' + arg)
      console.log('交易失败！原因是' + arg)
    })
  },

  /**
   * 加密并存储wallet数据到walletData
   *
   * @param state   [RN state对象]
   *
   * @returns {{address: *, privateKeyRaw: string, mnemonicRaw: string, balance: (number|*)}}
   */
  saveWalletData (state) {
    var walletData = {
      address: state.wallet.address,
      privateKeyRaw: CryptoJS.AES.encrypt(state.wallet.privateKey, state.pin).toString(),
      mnemonicRaw: CryptoJS.AES.encrypt(state.wallet.mnemonic, state.pin).toString(),
      balance: state.balance
    }
    return walletData
  },

  /**
   * 导出钱包为 KeyStore
   *
   * @param wallet    [钱包对象]
   * @param password  [钱包密码]
   *
   * @return {boolean}
   */
  saveKeyStore (wallet, password) {
    (wallet.RNencrypt(password)).then(function (json) {
      return json
    })

    return false
  },

  initWallet: async () => {
    const keystorePath = RNFS.DocumentDirectoryPath+ '/keystore.json'

    // if keystore file not exist, create a fake file
    try{
      let exist = await RNFS.exists(keystorePath);
      if (!exist) {
        let json = '{"address":"fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","id":"633246eb-18f3-4492-a6a4-bcac6d416306","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"167c8308417951a0cc5fd3fa53ce3c07"},"ciphertext":"b714decc1fab39ddca1748ce34f6c823006bbdfa1de3ddc64912e26db98ce49d","kdf":"scrypt","kdfparams":{"salt":"844142f3e9618d62f59b253766edf55f29e96b088f18f35767a8ee4b50e8d2c3","n":131072,"dklen":32,"p":1,"r":8},"mac":"004001adba97970b56c678bc579f47526b2c2b9a6a2127b4a23dfc79d1f97cf7"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-09-29T03-09-28.0Z--fc379f1fe62a88e047c50a36f8c1e4fa3e93092f","mnemonicCounter":"ae63b34eb14407f942541d511a9dfccb","mnemonicCiphertext":"4b6fdef7b4ae9ba363144a61ebe1070b","version":"0.1"}}';
        let result = await RNFS.writeFile(keystorePath, json, 'utf8');
        // console.tron.log(result);
      }
    } catch (err) {
      console.tron.log('write file err', err)
      console.log('write file err', err)
    }


    if (!W) {
      W = { network: 'ropsten', keystorePath: keystorePath };
      // load keystore from keystorePath
      try {
        let keystore = await RNFS.readFile(keystorePath);
        console.tron.log('initWallet', keystore);
        W.keystore = keystore;
        let keystoreObj = JSON.parse(keystore);
        W.address = keystoreObj.address;
        W.keystoreInitialized = true;
      } catch (err) {
        console.tron.log('initWallet', err);
        W.keystoreInitialized = false;
      }



      //Decrypt keystore to wallet instance
      try {
        let wallet = await Wallet.RNfromEncryptedWallet(W.keystore, '123');
        W.wallet = wallet;
        console.tron.log('wallet decrypted', W);
      } catch (err) {
        console.tron.log('wallet decrypted err', err);
      }
    }
  },


}
