import axios from "axios";

var CryptoJS = require("crypto-js");
var ethers = require("ethers");
import abi from '../contract/abi'


module.exports = {
  contractAddress : "0xAe985667078744A8EFb0C6c0300D7861EF427148",
  betMaskJson:[
    {
      betMaskArr:[1 ,2]
    },
    {
      betMaskArr:[1 ,2 ,4 ,8 ,16 ,32]
    },
    {
      betMaskArr:[1 ,2 ,4 ,8 ,16 ,32]
    },
    {}
  ],

  placeBet(wallet,betMask, modulo, secret) {
    // var privateKey = "0x0123456789012345678901234567890123456789012345678901234567890124";
    // var wallet = new ethers.Wallet(privateKey);
    wallet.provider = ethers.providers.getDefaultProvider("ropsten");

    // http://192.168.50.9:7001/api/v1/games/dev/random

    var contractAddress = "0xAe985667078744A8EFb0C6c0300D7861EF427148";
    var contract = new ethers.Contract(contractAddress, abi, wallet);
    var betMaskSum = 0;
    for(var i = 0; i < 6; i++){
      if(this.state.answers[i]){
        betMaskSum = betMaskSum | this.state.betMaskArr[i]
      }
      console.log(betMaskSum.toString(2))
    }

    var betMask = betMaskSum;
    console.log(betMask)
    var modulo = 6;

    console.log('address',wallet.address)
    axios.put("http://192.168.50.9:7001/api/v1/games/dev/random",{
      "address": wallet.address,
      "network_id":'1'
    }).then((res) => {
      console.log(res);
      var commitLastBlock = secret.commitLastBlock;
      var commit = secret.commit;
      var r = secret.signature.r;
      var s = secret.signature.s;
      contract.placeBet(betMask, modulo, commitLastBlock, commit, r, s).then(function(tx) {
        console.log(tx);
      });
    }).catch(err => {
      console.log(err);
    });



  }

}
