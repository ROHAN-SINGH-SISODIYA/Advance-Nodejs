const userModel = require('../../../../core-modules/mongo/collections/users');

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
  const usePool = false;
  try {
     const userData=await userModel.loginUser(data, usePool);
     console.log("models data",userData);
  } catch (error) {
     console.error(error);
     throw error;
  }
}

module.exports = {
  saveUser,
  loginUser
};
