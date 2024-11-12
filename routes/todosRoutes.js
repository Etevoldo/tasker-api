const express = require('express');
const { verifyAuth, verifyTaskPerm } = require('../middleware/authVerify.js');
const controller = require('../controller/todosController.js');

const router = express.Router();

router.post('/', verifyAuth, controller.addPost);

router.route('/:id')
  .get(verifyAuth, (req, res) => res.send('get ok'))
  .put(verifyAuth, verifyTaskPerm, controller.updatePost)
  .delete((req, res) => res.send('delete ok'));

module.exports = router;

