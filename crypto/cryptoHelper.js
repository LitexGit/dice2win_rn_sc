import { randomBytes } from 'react-native-randombytes'


function generateRandomHex() {

  return new Promise((resolve, reject) => {
    randomBytes(32, (err, bytes) => {
      // bytes is a base64string
      if(err){
        reject(err)
      }else{
        resolve('0x' + bytes.toString("hex"));
      }
    })
  })
}

module.exports = {
  generateRandomHex
};
