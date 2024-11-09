const express = require('express');
const controller = require('../controller/authController.js');
const authVerify = require('../middleware/authVerify.js');

const router = express.Router();

router.post('/register', authVerify.verifyRegister, controller.register);

module.exports = router;
