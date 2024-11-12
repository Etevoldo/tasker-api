const db = require('./dbController');

async function addPost(req, res) {
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
    return res.status(500).send({message: "Couldn't add post"});
  }

  res.status(200).send({
    message: `Inserted task "${task.title}" to your tasklist`
  });
}

async function updatePost(req, res) {
  if (!isRightFormat(req.body)) { 
    return res.status(400).send({message : "Body in a wrong format!"});
  }

  res.send({message: `New task ${req.body} (not) added!`});
}

function isRightFormat(body) {
  //check if is right types
  if ((typeof body.title) !== 'string') return false;
  if ((typeof body.description) !== 'string') return false;

  //check if fields are populated
  if (!body.title.length) return false;
  // could prevent empty description but that would be annoying
  return true;
}

module.exports = { addPost, updatePost };
