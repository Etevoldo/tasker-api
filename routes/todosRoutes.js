const express = require('express');
const { verifyAuth, verifyTaskPerm } = require('../middleware/authVerify.js');
const controller = require('../controller/todosController.js');

const router = express.Router();

router.post('/', verifyAuth, controller.addTask);
router.get('/', verifyAuth, controller.getTasks);

router.route('/:id')
  .put(verifyAuth, verifyTaskPerm, controller.updateTask)
  .delete(verifyAuth, verifyTaskPerm, controller.deleteTask);

module.exports = router;
