const express = require('express');
const middleware = require('../middleware/authVerify.js');
const controller = require('../controller/todosController.js');

const router = express.Router();

router.post('/', middleware.verifyAuth, controller.addPost);

router.route('/:id')
  .get(middleware.verifyAuth, controller.addPost)
  .put((req, res) => res.send('put ok'))
  .delete((req, res) => res.send('delete ok'));

module.exports = router;

