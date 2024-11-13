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

  // `result.insertId` returns bigInt and json parser hates it,
  // converting into a string to fix it
  res.status(200).send({ id: result.insertId.toString(), ...task });
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
  res.status(200).send({ id: req.params.id.toString(), ...task });
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

module.exports = { addTask, updateTask };
