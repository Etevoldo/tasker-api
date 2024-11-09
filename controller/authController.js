const db = require('./dbController');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth.js');

async function register(req, res) {
  const { username, email, password } = req.body;

  const data = {
      username: username,
      email: email,
      password: bcrypt.hash(password, 8),
  };

  const result = await db.addUser(data);

  if (result === -1) {
    return res.status(500).send({message: "couldn't register!"});
  }

  const token = jwt.sign({
    username: username,
    exp: Math.floor(Date.now() / 1000) + (60) //1 minute from now on
  }, secret);

  res.send({
    message: `${username} sucessfull registred`,
    token: token
  });
};

module.exports = {register};
