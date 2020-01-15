const _ = require('lodash');

const userModel = require('../../models/user');
const validate = require('./validate');
const customError = require('../../../../core-modules/common/custom-error');

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
  let data;
  const { body } = req;
  const response = validate.login(body);

  if (!_.isEmpty(response)) {
    return res.status(400).json({ code: 1001, message: 'invalid input' });
  }

  try {
    await userModel.loginUser(body);
  } catch (error) {
    if (error instanceof customError.InvalidInputError) {
      return res.status(400).json({ code: 1001, message: error._message });
    }
    if (error instanceof customError.NotFoundError) {
      return res.status(400).json({ code: 1001, message: 'email not found' });
    }
    return res.status(500).send({ code: 1005 });
  }

  res.status(200).send({ code: 0 });
}

module.exports = {
  register,
  login,
};
