const express = require('express');
const { verifyAuth } = require('../middleware/authVerify.js');
const controller = require('../controller/todosController.js');

const router = express.Router();

router.post('/', verifyAuth, controller.addPost);

router.route('/:id')
  .get(verifyAuth, controller.addPost)
  .put(verifyAuth, (req, res) => res.send('put ok'))
  .delete((req, res) => res.send('delete ok'));

module.exports = router;

