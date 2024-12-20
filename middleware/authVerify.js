'use strict';

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
  const token = req.body.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.email = decoded.email;
  }
  catch(err) {
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({
        message: "Access token expired! refresh it in /refreshToken"
      });
    }
    return res.status(401).send({ message: "Token invalid!" });
  }
  next();
}

async function verifyTaskPerm(req, res, next) {
  const id_req = req.params.id;

  const task = await db.queryTask(id_req, ['id_user']);
  if (task.length === 0) return res.status(404).send(); // task doesn't exist

  const user = await db.queryUser(req.email, ['id']);
  if (task[0].id_user !== user[0].id) {
    return res.status(403).send({message: "Forbidden!"});
  }
  req.idUser = task[0].id_user;
  next();
}

module.exports = { verifyRegister, verifyLogin, verifyAuth, verifyTaskPerm };
