const db = require('./dbController');

async function addPost(req, res) {
  const result = await db.queryUser(req.email, ['id']);
  const id = result[0].id;

  res.send({
    message: `Your post "${req.body.title}" was inserted into id ${id}`
  });
}

module.exports = { addPost };
