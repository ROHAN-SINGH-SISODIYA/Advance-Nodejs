const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user')
const {regsiterValidate} = require('../../controllers/user/validate');

router.post('/register',regsiterValidate,userController.registeration);

module.exports = router;