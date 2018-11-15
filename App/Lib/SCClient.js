'use strict'

// 加载必要类库
var SCClient = require("statechannelnode");
var io = require("socket.io-client");
let SQLite = require('react-native-sqlite-storage');
var squel = require("squel");
const url = require('url');
let dbfactory = require('../../db/dbfactory');
// let Web3 = require('web3');

// let channelIdentifier = '';

function getClient() {
    console.log("Database OPENED");
    
    
    let address = '0x56d77fcb5e4Fd52193805EbaDeF7a9D75325bdC0';
    let privateKey = '118538D2E2B08396D49AB77565F3038510B033A74C7D920C1C9C7E457276A3FB';

    let socket = io("http://192.168.51.227");
    let dbprovider = { type: 'react-native', config: { db: this.db } };
    let dbhelper = dbfactory.initDBHelper(dbprovider);

    console.tron.log(dbhelper);
    let scclient = new SCClient(web3, dbhelper, address, privateKey);
    
    scclient.initMessageHandler(socket);

    return scclient;

    // let partnerAddress = '0x633177eeE5dB5a2c504e0AE6044d20a9287909f9';
    // channelIdentifier = await scclient.blockchainProxy.getChannelIdentifier(partnerAddress);
    /*
    refresh();
    
    scclient.on('BetPlaced', (channel, bet)=>{

        this.setState({ contentstr: 'BetPlaced' });

    });

    scclient.on('BetSettled', (channel, bet)=>{
        this.setState({ contentstr: "BetSettled" });
        this.refresh();
    });

    scclient.on('ChannelOpen', (channel)=>{
        channelIdentifier = channel.channelId;
        refresh();
    }).on('CooperativeSettled', (channel)=>{
        refresh();
    })
    */
}


function refresh() {
    scclient.dbhelper.getChannel(this.channelIdentifier).then((channel) => {
        if(!channel)
            return;
        
        let str = "local: " + channel.localBalance + "    remote: " + channel.remoteBalance + " status: " + channel.status;
        this.setState({ channelstr: str });
    });
}
