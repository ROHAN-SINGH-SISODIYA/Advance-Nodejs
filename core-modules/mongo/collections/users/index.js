const config = require('config');
const jwt = require('jsonwebtoken'); // to generate signed token

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

async function loginUser(data, usePool,callback) {
  let conn;
  try {
     conn = await getDBConnection(usePool);
     const Model = conn.model(COLLECTION_NAME, schema);
     const {email,password}=data
     console.log(data);
     Model.findOne({ email }, (err, user) => {
      if (err || !user) {
          console.log(err); 
          return callback({status:400,error:'User with that email does not exist. Please signup'});
      }
      // if user is found make sure the email and password match
      // create authenticate method in user model
      if (!user.authenticate(password)) {
          return callback({status:401,error:'Email and password dont match'});
      }
      // generate a signed token with user id and secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      // persist the token as 't' in cookie with expiry date
      res.cookie('t', token, { expire: new Date() + 9999 });
      // return response with user and token
      const { _id, name, email} = user;
      return callback({ token, user: { _id,name,email} });
  });

  }catch (ex) {
      closeConnection(conn, usePool);
      throw ex;
  }
  closeConnection(conn, usePool);
}

module.exports = {
  saveUser,loginUser
};
