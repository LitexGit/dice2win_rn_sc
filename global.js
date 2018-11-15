// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
global.process = require('process');

const Web3 = require('web3');
// const web3 = new Web3();
let ethWSUrl = 'ws://54.250.21.165:8546';
let web3 = new Web3(Web3.givenProvider || ethWSUrl);
global.web3 = web3;