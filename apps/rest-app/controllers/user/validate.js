const _ = require('lodash');
const Joi = require('joi');

function register(data) {
  const userSchema = {
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  };

  const validationResults = Joi.validate(data, userSchema, {
    allowUnknown: false,
    abortEarly: false,
  });

  return (_.isEmpty(validationResults.error)) ? null : validationResults;
}

module.exports = {
  register,
};
