const { saveUser } = require('../');

const data = {
  name: 'Saif',
  email: 'saif@pushengage.com',
  password: '122',
};

const data1 = {
  name: 'Saif',
  email: 'saif@pushengag.com',
  password: '122',
};


const usePool = false;

saveUser(data, usePool)
  .then(() => console.log('success'))
  .catch(error => console.log(error));

saveUser(data1, usePool)
  .then(() => console.log('success'))
  .catch(error => console.log(error));
