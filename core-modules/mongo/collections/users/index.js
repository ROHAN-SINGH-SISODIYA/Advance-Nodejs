const config = require('config');

const { getConnectionSettings } = require('../../connection-helper');
const mongooseHelper = require('../../');
const schema = require('./schema');

const dbConfig = config.get('mongodb.rohan');
const COLLECTION_NAME = 'users';

const dbParams = getConnectionSettings(dbConfig);

async function getDBConnection(usePool) {
  // use Pool is for future
  // use Pool is Boolean
  return usePool
    ? mongooseHelper.getConnectionFromPool(dbParams.uri, dbParams.options)
    : mongooseHelper.getConnection(dbParams.uri, dbParams.options);
}

async function closeConnection(conn, usePool) {
  try {
    if (!usePool && conn) {
      await conn.close();
    }
  } catch (error) {
    console.log(error);
    // do not throw error
    // query might have executed successfully
  }
}

async function saveUser(data, usePool) {
  let conn;
  try {
    conn = await getDBConnection(usePool);
    const Model = conn.model(COLLECTION_NAME, schema);
    await new Model(data).save();
  } catch (ex) {
    closeConnection(conn, usePool);
    throw ex;
  }

  closeConnection(conn, usePool);
}

module.exports = {
  saveUser,
};
