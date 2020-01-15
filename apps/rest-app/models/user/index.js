const _ = require('lodash');
const jwt = require('jsonwebtoken'); // to generate signed token

const userModel = require('../../../../core-modules/mongo/collections/users');
const customError = require('../../../../core-modules/common/custom-error');

async function saveUser(data) {
  const usePool = false;

  try {
    await userModel.saveUser(data, usePool);
  } catch (error) {
    // handle duplicate entry message and take appropriate action
    // while giving response
    console.error(error);
    // need better logger module, hope to built in fulture

    throw error;
  }
}

async function loginUser(data) {
  let user;
  const { password } = data;
  const usePool = false;
  const query = {
    email: data.email,
  };
  const options = {
    projection: {
      email: 1,
      _id: 0,
    },
  };

  try {
    user = await userModel.loginUser(query, options, usePool);
    console.log('models data', user);
  } catch (error) {
    throw error;
  }

  if (_.isEmpty(user)) {
    throw new customError.NotFoundError('user not found');
  }

  if (!user.authenticate(password)) {
    throw new customError.InvalidInputError('password does not match');
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  console.log('user', user);
  console.log('token', token);
  // callback.cookie('t', token, { expire: new Date() + 9999 });

  const { _id, name, email } = user;
  // i want to return token and user info using callback to model
  return { token, user: { _id, name, email } };
}

module.exports = {
  saveUser,
  loginUser,
};
