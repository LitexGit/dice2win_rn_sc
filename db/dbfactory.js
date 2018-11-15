// const nodeDBHelper = require("./nodejs/nodeDBHelper");
const rnDBHelper = require("./react-native/rnDBHelper");

function initDBHelper(dbprovider) {

    let dbhelper = null;
    // if (dbprovider.type == 'node') {
    //     dbhelper = (new nodeDBHelper(dbprovider.config));
    //     await dbhelper.init();
    // } else {
        dbhelper = (new rnDBHelper(dbprovider.config));
        dbhelper.init();
    // }

    return dbhelper;
}

module.exports = {
  initDBHelper
};