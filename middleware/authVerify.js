const db = require('../controller/dbController');
const jwt = require('jsonwebtoken');

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

async function verifyLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email) return res.status(400).send({ message: "Missing email" });
  if (!password) return res.status(400).send({ message: "Missing password!" });

  next();
}

async function verifyAuth(req, res, next) {
  const token = req.body.token; //TODO take from Autorization instead of body

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.exp <= (Date.now() / 1000)) {
      return res.status(401).send({ message: "Token expired!" });
    }

    req.email = decoded.email;
  }
  catch(err) {
    return res.status(401).send({ message: "Token invalid!" });
  }
  next();
}

async function verifyTaskPerm(req, res, next) {
  //const { id_req, email } = req.body;
  console.log("verified task perms");
  next();
}

module.exports = { verifyRegister, verifyLogin, verifyAuth };
