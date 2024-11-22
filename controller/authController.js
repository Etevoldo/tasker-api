'use strict';

const db = require('./dbController.js');
const rTokenDB = require('./refreshTokenController.js');
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
  const refreshToken = await rTokenDB.createToken(email);

  res.send({
    message: `${username} sucessfull registred`,
    token: token,
    refreshToken: refreshToken
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
    exp: Math.floor(Date.now() / 1000) + (60) //1 minute from now on
  }, process.env.JWT_SECRET);
  const refreshToken = await rTokenDB.createToken(email);

  res.send({
    message: `${email} sucessfull logged in`,
    token: token,
    refreshToken: refreshToken
  });
}

async function refreshToken(req, res) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(403).send({message: 'Refresh Token Required!'});
  }

  //get token info in de db
  let refreshTokenContents = (await rTokenDB.getToken(refreshToken));
  if (!refreshTokenContents) { //if rtoken doesn't exists in db
    return res.status(403).send({message: 'Token not in database!'});
  }

  //decode token and get exp date
  const decodedToken = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    { ignoreExpiration: true }
  );

  if (decodedToken.exp <= (Date.now() / 1000)) {
    //TODO: delete all user tokens in case of expiration
    await rTokenDB.delToken(refreshToken);
    return res.status(403).send({message: 'Token expired, login again'});
  }
  //TODO: add reuse detection with a delete all tokens (of a user) function

  //if everything is ok
  const newAcessToken = jwt.sign({
    email: refreshTokenContents.user,
    exp: Math.floor(Date.now() / 1000) + (60) //1 minute
  }, process.env.JWT_SECRET);

  const newRefreshToken = await rTokenDB.createToken(refreshTokenContents.user);
  //TODO: instead of deleting, mark as used for the automatic reuse detection
  await rTokenDB.delToken(refreshToken);

  res.status(200).send({
    acessToken: newAcessToken,
    refreshToken: newRefreshToken
  });
}

module.exports = {register, login, refreshToken};
