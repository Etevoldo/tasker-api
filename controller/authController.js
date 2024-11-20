'use strict';

const db = require('./dbController');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { username, email, password } = req.body;

  const data = {
      username: username,
      email: email,
      password: await bcrypt.hash(password, 8)
  };

  const result = await db.addUser(data);

  if (result === -1) {
    return res.status(500).send({message: "couldn't register!"});
  }

  const token = jwt.sign({
    email: email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) //1 hour from now on
  }, process.env.JWT_SECRET);

  res.send({
    message: `${username} sucessfull registred`,
    token: token
  });
};

async function login(req, res) {
  const { email, password } = req.body;

  const result = await db.queryUser(email);

  if (result.length !== 1) { // not found
    return res.status(401).send({message: "E-mail address not found"});
  }
  if (!bcrypt.compareSync(password, result[0].password)) {
    return res.status(401).send({message: "Wrong password!"});
  }

  const token = jwt.sign({
    email: email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) //1 hour from now on
  }, process.env.JWT_SECRET);

  res.send({
    message: `${email} sucessfull logged in`,
    token: token
  });
}

module.exports = {register, login};
