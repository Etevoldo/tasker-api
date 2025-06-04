'use strict';

const express = require('express');
const controller = require('../controller/authController.js');
const authVerify = require('../middleware/authVerify.js');

const router = express.Router();

router.post('/register', authVerify.verifyRegister, controller.register);
router.post('/login', authVerify.verifyLogin, controller.login);
router.post('/refreshTokenRenew', controller.refreshTokenRenew);

module.exports = router;
