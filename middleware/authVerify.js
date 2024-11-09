const db = require('../controller/dbController');

async function verifyRegister(req, res, next) {
  const { username, email, password } = req.body;
  if (!username) return res.status(400).send({ message: "Missing username" });
  if (!email) return res.status(400).send({ message: "Missing email" });
  if (!password) return res.status(400).send({ message: "Missing password!" });

  const data = await db.queryUser(email);
  if (data.length > 0) { //does exist
    return res.send({message: `${email} already exists`});
  }
  next();
}

module.exports = { verifyRegister };
