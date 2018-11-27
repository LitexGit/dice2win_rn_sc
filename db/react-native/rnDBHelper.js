/**
 * DB Objects
 * 1. channel
 * 2. payment
 * 3. transfer
 * 4. bet
 *
 */

require('es5-ext/array/#/@@iterator/implement');
const squel = require("squel");
class rnDBHelper {
    constructor(config) {
        console.log('init rnDBHelper', config);
        this.db = config.db;
        this.TABLE_CHANNEL = "channels";
        this.TABLE_BET = "bets";
        this.TABLE_TRANSFER = "transfers";
        this.TABLE_PAYMENT = "payments";
    }

    async init() {
        console.log("init finished");
    }

    async addChannel(channel) {

        let sql = squel
            .insert()
            .into(this.TABLE_CHANNEL)
            .setFields(channel)
            .set('createdAt', new Date().toISOString())
            .set('updatedAt', new Date().toISOString())
            .toString();

        console.log("addChannel sql", sql);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    resolve(true);
                });
            });
        });
    }

    async updateChannel(channelId, newAttr) {
        let sql = squel
            .update()
            .table(this.TABLE_CHANNEL)
            .setFields(newAttr)
            .set('updatedAt', new Date().toISOString())
            .where('channelId=?', channelId)
            .toString();

        console.log("updateChannel sql", sql);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    resolve(true);
                });
            });
        });


    }

    async deleteChannel(channelId) {
        let sql = squel
            .delete()
            .from(this.TABLE_CHANNEL)
            .where('channelId=?', channelId)
            .toString();

        console.log("deleteChannel sql", sql);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    resolve(true);
                });
            });
        });


    }

    async getChannels(condition, offset, limit) {

        let sql = squel
            .select()
            .from(this.TABLE_CHANNEL);
      if (condition != null && typeof (condition) == 'object') {
        let keys = Object.keys(condition);
        for (var key of keys) {
          sql = sql.where(key + "=?", condition[key]);
        }
      }
      sql = sql
        .offset(offset)
        .limit(limit)
        .order("createdAt", false)
        .toString();

        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    let data = convertResult(result);
                    resolve(data);
                });
            });
        });
    }


    async getChannel(channelId) {

        let sql = squel
            .select()
            .from(this.TABLE_CHANNEL)
            .where("channelId=?", channelId)
            .toString();

        console.log('getChannel sql ', sql);

        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    let data = convertResult(result);
                    let dataItem = data.length > 0 ? data[0] : null;
                    resolve(dataItem);
                });
            });
        });

    }

    async addPayment(payment) {
        let sql = squel
            .insert()
            .into(this.TABLE_PAYMENT)
            .setFields(payment)
            .set('updatedAt', new Date().toISOString())
            .set('createdAt', new Date().toISOString())
            .toString();

        console.log("addPayment sql", sql);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    resolve(true);
                });
            });
        });
    }

    async getPayments(condition, offset, limit) {
      console.log('start getPayments in rnDBHelper');
      let sql = squel
            .select()
            .from(this.TABLE_PAYMENT);

      if (condition != null && typeof condition == "object") {
        let keys = Object.keys(condition);
        for (var key of keys) {
          sql = sql.where(key + "=?", condition[key]);
        }
      }
      sql = sql
        .offset(offset)
        .limit(limit)
        .order("paymentId", false)
        .toString();

        console.log("getPayments sql", sql);

        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    let data = convertResult(result);
                    console.log("payments data", data);
                    resolve(data);
                });
            });
        });
    }

    async addTransfer(transfer) {

        let sql = squel
            .insert()
            .into(this.TABLE_TRANSFER)
            .setFields(transfer)
            .set('updatedAt', new Date().toISOString())
            .set('createdAt', new Date().toISOString())
            .toString();

        console.log("addTransfer sql", sql);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    resolve(true);
                });
            });
        });
    }

    async updateTransfer(transferId, newAttr) {
        let sql = squel
            .update()
            .table(this.TABLE_TRANSFER)
            .setFields(newAttr)
            .set('updatedAt',new Date().toISOString())
            .where('transferId=?', transferId)
            .toString();

        console.log("updateTransfer sql", sql);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    resolve(true);
                });
            });
        });

    }

    async deleteTransfer(transferId) {
        let sql = squel
            .delete()
            .from(this.TABLE_TRANSFER)
            .where('transferId=?', transferId)
            .toString();

        console.log("deleteTransfer sql", sql);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    resolve(true);
                });
            });
        });
    }

    async getTransfer(transferId) {
        let sql = squel
            .select()
            .from(this.TABLE_TRANSFER)
            .where("transferId=?", transferId)
            .toString();

        console.log('getChannel sql ', sql);

        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    let data = convertResult(result);
                    let dataItem = data.length > 0 ? data[0] : null;
                    resolve(dataItem);
                });
            });
        });
    }

    async getLatestTransfer(where) {
        let sql = squel.select().from(this.TABLE_TRANSFER);
      if (where != null && typeof where == "object") {
        let keys = Object.keys(where);
        for (var key of keys) {
          sql = sql.where(key + "=?", where[key]);
        }
      }
        sql = sql.order("nonce", false).toString();

        console.log('getLatestTransfer sql', sql);

        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    let data = convertResult(result);
                    let dataItem = data.length > 0 ? data[0] : null;
                    resolve(dataItem);
                });
            });
        });
    }

    async addBet(bet) {
        let sql = squel
            .insert()
            .into(this.TABLE_BET)
            .setFields(bet)
            .set('updatedAt', new Date().toISOString())
            .set('createdAt', new Date().toISOString())
            .toString();

        console.log("addBet sql", sql);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    resolve(true);
                });
            });
        });
    }

    async updateBet(betId, newAttr) {

        let sql = squel
            .update()
            .table(this.TABLE_BET)
            .setFields(newAttr)
            .set('updatedAt', new Date().toISOString())
            .where('betId=?', betId)
            .toString();

        console.log("updateBet sql", sql);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    resolve(true);
                });
            });
        });
    }

    async getBets(condition, offset, limit) {

      console.log('start getBets in rnDBHelper', condition, offset, limit);
      let sql = squel
            .select()
            .from(this.TABLE_BET);
      if (condition != null && typeof (condition) == 'object') {
        let keys = Object.keys(condition);
        for(var key of keys){
            sql = sql.where(key + "=?", condition[key]);
        }
      }
      sql = sql
        .offset(offset)
        .limit(limit)
        .order("betId", false)
        .toString();

      console.log('getBets sql is ', sql);

        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    let data = convertResult(result);
                    resolve(data);
                });
            });
        });
    }

    async getBet(betId) {
        let sql = squel
            .select()
            .from(this.TABLE_BET)
            .where("betId=?", betId)
            .toString();

        console.log('getBet sql ', sql);

        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    let data = convertResult(result);
                    let dataItem = data.length > 0 ? data[0] : null;
                    resolve(dataItem);
                });
            });
        });
    }

    async getBetByChannel(where) {
        let sql = squel.select().from(this.TABLE_BET);
        if(where != null && typeof(where) == 'object'){
          let keys = Object.keys(where);
          for(var key of keys){
              sql = sql.where(key + "=?", where[key]);
          }
        }
        sql = sql.order("round", false).toString();

        console.log('getBetByChannel sql', sql);

        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    let data = convertResult(result);
                    let dataItem = data.length > 0 ? data[0] : null;
                    resolve(dataItem);
                });
            });
        });
    }

    async getLatestRound(channelId) {
        let sql = squel
          .select()
          .from(this.TABLE_BET)
          .where("channelId=?", channelId)
          .order("round", false)
          .toString();

        console.log('getBetByChannel sql', sql);

        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, [], (tx, result) => {
                    let data = convertResult(result);
                    let newRound = data.length > 0 ? parseInt(data[0].round) + 1: 1;
                    resolve(newRound);
                });
            });
        });
    }
}

function convertResult(results) {
    var len = results.rows.length;
    // console.log('convertResult len is ', len);
    let data = [];
    for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        data.push(row);
    }
    return data;
}

function getChannelIdentifier() {
    let sql = squel
        .select("channelId")
        .from(this.TABLE_CHANNEL)
        .where("status=?", 2)
        .order("createdAt", "DESC")
        .toString();

    console.log('get Channel Id sql ', sql);

    return new Promise((resolve, reject) => {
        this.db.transaction(tx => {
            tx.executeSql(sql, [], (tx, result) => {
                let data = convertResult(result);
                let dataItem = data.length > 0 ? data[0] : null;
                resolve(dataItem);
            });
        });
    });
}
module.exports = rnDBHelper;
