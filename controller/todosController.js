'use strict';

const db = require('../models');
const Task = db.Task;
const User = db.User;

async function addTask(req, res) {
  if (!isRightFormat(req.body)) {
    res.status(400).send({ message : 'Body in a wrong format!' });
  }
  try {
    const user = await User.findOne({
      where: {
        email: req.email
      },
      attributes: ['id']
    });

    if (user === null) {
      return res.status(401).send({ message: 'You\'re disconnected' });
    }
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      id_user: user.id
    });

    res.status(200).send({
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Couldn\'t add task' });
  }
}

async function updateTask(req, res) {
  const task = {
    title: req.body.title,
    description: req.body.description,
    isCompleted: req.body.isCompleted
  };

  if (!isRightFormat(task)) {
    return res.status(400).send({ message : 'Body in a wrong format!' });
  }
  try {
    const taskIns = await Task.findByPk(req.params.id);

    taskIns.title = req.body.title;
    taskIns.description = req.body.description;
    taskIns.isCompleted = req.body.isCompleted;
    taskIns.save();

    res.status(200).send({
      id: taskIns.id,
      title: taskIns.title,
      description: taskIns.description,
      isCompleted: taskIns.isCompleted
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Couldn\'t update task' });
  }
}

async function deleteTask(req, res) {
  try {
    await Task.destroy({
      where: {
        id: req.params.id
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Couldn\'t delete task' });
  }

  res.status(204).send();
}

async function getTasks(req, res) {
  try {
    const user = await User.findOne({
      where: {
        email: req.email
      },
      attributes: ['id']
    });

    if (user === null) {
      return res.status(401).send({ message: 'You\'re disconnected' });
    }

    // get pagination info
    const sParams = new URLSearchParams(req.url.split('?')[1]);
    const page = parseInt(sParams.get('page'));
    const limit = parseInt(sParams.get('limit'));

    // lazy loading the tasks
    const tasks = await user.getTasks({
      attributes: { exclude: ['id_user'] },
      limit: limit,
      offset: (page - 1) * limit
    });

    const totalNumberOfTasks = await Task.count({
      where: { id_user: user.id }
    });

    res.status(200).send(
      formatPaginate(tasks, page, limit, totalNumberOfTasks)
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Couldn\'t get tasks' });
  }
}
// might exclude this since sequelize has built in pagination
function formatPaginate(rows, page, limit, total) {
  const formatedPage = {
    data: [],
    page: page,
    limit: limit,
    total: total
  };

  for (const row of rows) {
    delete row.id_user;
    formatedPage.data.push(row.toJSON());
  }

  return formatedPage;
}

function isRightFormat(body) {
  // check if is right types
  if ((typeof body.title) !== 'string') return false;
  if ((typeof body.description) !== 'string') return false;

  // check if title is empty
  if (!body.title.length) return false;
  // could prevent empty description but that would be annoying
  return true;
}

module.exports = { addTask, updateTask, deleteTask, getTasks };
