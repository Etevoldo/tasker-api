const db = require('./dbController');

async function addPost(req, res) {
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

module.exports = { addPost };
