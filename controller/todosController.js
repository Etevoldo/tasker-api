'use strict';

const db = require('./dbController');

async function addTask(req, res) {
  if (!isRightFormat(req.body)) { 
    res.status(400).send({message : "Body in a wrong format!"});
  }

  const idResult = await db.queryUser(req.email, ['id']);
  const idUser = idResult[0].id;

  const task = {
    title: req.body.title,
    description: req.body.description
  };

  const result = await db.addTask(task, idUser);

  if (result === -1) {
    return res.status(500).send({message: "Couldn't add task"});
  }

  res.status(200).send({ id: result.insertId, ...task });
}

async function updateTask(req, res) {

  const task = {
    title: req.body.title,
    description: req.body.description
  };

  if (!isRightFormat(task)) {
    return res.status(400).send({message : "Body in a wrong format!"});
  }

  const result = await db.modifyTask(task, req.params.id ,req.idUser);

  if (result === -1) {
    return res.status(500).send({message: "Couldn't modify task"});
  }

  // could query for the just inserted Task, but it would be a waste
  res.status(200).send({ id: parseInt(req.params.id), ...task });
}

async function deleteTask(req, res) {
  const result = await db.deleteTask(req.params.id);

  if (result === -1) {
    return res.status(500).send({message: "Couldn't delete task"});
  }

  res.status(204).send();
}

async function getTasks(req, res) {
  const idResult = await db.queryUser(req.email, ['id']);
  const userId = idResult[0].id;
  const tasks =
      await db.queryTasksByUserId(userId, ['id', 'title', 'description']);

  const sParams = new URLSearchParams(req.url.split('?')[1]);
  const page  = parseInt(sParams.get('page'));
  const limit = parseInt(sParams.get('limit'));

  res.status(200).send(paginate(tasks, page, limit));
}

function paginate(data, page, limit) {
  const formatedPage = {
    data: [],
    page: page,
    limit: limit,
    total: data.length
  };

  const bottomStart = (page - 1) * limit;
  const upperLimit = bottomStart + limit;

  for (let i = bottomStart; (i < upperLimit) && data[i]; i++) {
    formatedPage.data.push(data[i]);
  }

  return formatedPage;
}

function isRightFormat(body) {
  //check if is right types
  if ((typeof body.title) !== 'string') return false;
  if ((typeof body.description) !== 'string') return false;

  //check if title is empty
  if (!body.title.length) return false;
  // could prevent empty description but that would be annoying
  return true;
}

module.exports = { addTask, updateTask, deleteTask, getTasks };
