const _ = require('lodash');

const userModel = require('../../models/user');
const validate = require('./validate');

async function register(req, res) {
  const { body } = req;

  const response = validate.register(body);

  if (!_.isEmpty(response)) {
    return res.status(400).json({ code: 1001, message: 'invalid input' });
  }

  try {
    await userModel.saveUser(body);
  } catch (error) {
    return res.status(500).send({ code: 1005 });
  }

  res.status(200).send({ code: 0 });
}

async function login(req, res) {
  const { body } = req;

  const response = validate.login(body);

  if (!_.isEmpty(response)) {
     return res.status(400).json({ code: 1001, message: 'invalid input' });
  }

  try {
     await userModel.loginUser(body);
  } catch (error) {
      return res.status(500).send({ code: 1005 });
  }

  res.status(200).send({ code: 0 });
}

module.exports = {
  register,
  login
};
