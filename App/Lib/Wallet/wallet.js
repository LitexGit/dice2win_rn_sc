'use strict'

// import React, { Component } from 'react'

const CryptoJS = require('crypto-js')
const ethers = require('ethers')

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
    var bytes = CryptoJS.AES.decrypt(walletData.mnemonicRaw, pin)
    var mnemonic = bytes.toString(CryptoJS.enc.Utf8)
    var wallet = ethers.Wallet.fromMnemonic(mnemonic)
    if (wallet.address == walletData.address) {
      return wallet
    }

    return false
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
  getBalance (wallet) {
    var balancePromise = wallet.getBalance()

    balancePromise.then((balanceRaw) => {
      var balance = parseInt(balanceRaw) / 1e18
      return balance
    }).catch(arg => alert('获取余额失败！原因是' + arg))
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
  }

}
