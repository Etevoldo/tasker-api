'use strict';

const db = require('../models');
const jwt = require('jsonwebtoken');

async function verifyRegister(req, res, next) {
  const { username, email, password } = req.body;
  if (!username) return res.status(400).send({ message: 'Missing username' });
  if (!email) return res.status(400).send({ message: 'Missing email' });
  if (!password) return res.status(400).send({ message: 'Missing password!' });

  next();
}

async function verifyLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email) return res.status(400).send({ message: 'Missing email' });
  if (!password) return res.status(400).send({ message: 'Missing password!' });

  next();
}

async function verifyAuth(req, res, next) {
  const token = req.body.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.email = decoded.email;
  }
  catch (err) {
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({
        message: 'Access token expired! refresh it in /refreshToken'
      });
    }
    return res.status(401).send({ message: 'Token invalid!' });
  }
  next();
}

async function verifyTaskPerm(req, res, next) {
  const Task = db.Task;
  const User = db.User;
  const task_id = req.params.id;

  try {
    const task = await Task.findByPk(task_id);

    if (task === null) {
      return res.status(404).send({ message: 'This task doesn\'t exist' });
    }

    const user = await User.findOne({
      where: {
        email: req.email
      },
      attributes: ['id']
    });
    if (task.id_user !== user.id) {
      // fake 404, this condition actually means the
      // user is trying to update a task they don't have permissions
      return res.status(404).send({ message: 'Task doesn\'t exist' });
    }
    req.id_user = task.id_user;
  } catch (error) {
    console.error(error);
    return res.status(500).send('Coundn\'t verify task permissions');
  }

  next();
}

module.exports = { verifyRegister, verifyLogin, verifyAuth, verifyTaskPerm };
