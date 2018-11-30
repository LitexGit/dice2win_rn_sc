// Inject node globals into React Native global scope.
// const url = require('url');
// console.log(url.URL);
// import { URL, URLSearchParams } from "whatwg-url";
import Config from "react-native-config"

// disable console.log in production mode
if(Config.DEBUG_LOG == '0'){
  console.log = ()=>{};
}

console.log = console.tron.log;

global.Buffer = require('buffer').Buffer;
global.process = require('process');
global.btoa = require('btoa');

// global.URL = URL;
// global.URLSearchParams = URLSearchParams;
// const Web3 = require('web3');
// let ethWSUrl = 'ws://54.250.21.165:8546';
// let web3 = new Web3(Web3.givenProvider || ethWSUrl);
var URI = require('urijs');
global.URL = URI;
const Web3 = require('web3');
global.ethWSUrl = Config.ETH_WS_URL;
let web3 = new Web3(Web3.givenProvider || ethWSUrl);

global.web3 = web3;
global.scclient = null;
global.dbInitializing = false;
