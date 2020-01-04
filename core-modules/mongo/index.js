// Refer:
// http://blog.mlab.com/2014/04/mongodb-driver-mongoose/
// http://blog.mlab.com/2013/11/deep-dive-into-connection-pooling/
// http://blog.mlab.com/2013/10/do-you-want-a-timeout/

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const defaultConnOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // above options are new
  // don't know about it while wrting, but had to use to avoid errors
  // http://mongodb.github.io/node-mongodb-native/3.3/reference/unified-topology/
  connectTimeoutMS: 5000,
  /*
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true,
    commented option are deprecated in this new version of mongoose
    please do test for production
  */
  useCreateIndex: true,
  /*
    ensureIndex is deprecated so useCreateIndex option
    https://github.com/Automattic/mongoose/issues/6890
  */
  bufferMaxEntries: 0,
  keepAlive: 300000,
  poolSize: 5,
  readPreference: 'secondaryPreferred',
};

function getConnection(dbURI, options) {
  // just overwrite the default conn options
  const connOptions = Object.assign({}, defaultConnOptions, options);
  const connection = mongoose.createConnection();

  return connection.openUri(dbURI, connOptions);
}

module.exports = {
  getConnection,
};
