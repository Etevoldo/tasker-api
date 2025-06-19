'use strict';

const db = require('../models');
const User = db.User;
const RefreshToken = db.RefreshToken;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { username, email, password } = req.body;

  const userData = {
    name: username,
    email: email,
    password: await bcrypt.hash(password, 8)
  };

  try {
    await User.create(userData);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send({ message: 'This email already exists' });
    }
    else {
      return res.status(500).send({ message: 'Coundn\'t register' });
    }
  }

  const { token, refreshToken } = createTokenPair(email);

  try {
    await RefreshToken.create({
      refreshToken: refreshToken,
      email_user: email
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'couldn\'t register!' });
  }

  res.send({
    message: `${username} sucessfull registred`,
    token: token,
    refreshToken: refreshToken
  });
};

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (user === null) {
      return res.status(401).send({ message: 'E-mail address not found' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({ message: 'Wrong password!' });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Unknown error' });
  }

  const { token, refreshToken } = createTokenPair(email);

  const refreshTokenIns = RefreshToken.build({
    refreshToken: refreshToken,
    email_user: email
  });

  try {
    // saving to the databse
    await refreshTokenIns.save();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'fixthis' });
  }

  res.send({
    message: `${email} sucessfull logged in`,
    token: token,
    refreshToken: refreshToken
  });
}

async function refreshTokenRenew(req, res) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(403).send({ message: 'Refresh Token Required!' });
  }

  // get token info in de db
  const refreshTokenIns = await RefreshToken.findByPk(refreshToken);
  if (!refreshTokenIns) { // if rtoken doesn't exists in db
    return res.status(403).send({ message: 'Token not in database!' });
  }

  // decode token and get exp date
  const decodedToken = jwt.verify(
    refreshTokenIns.refreshToken, // token itself
    process.env.JWT_REFRESH_SECRET,
    { ignoreExpiration: true }
  );

  if (decodedToken.exp <= (Date.now() / 1000)) {
    RefreshToken.destroy({
      where: { email_user: refreshTokenIns.email_user }
    });
    return res.status(403).send({ message: 'Token expired, login again' });
  }

  if (refreshTokenIns.used) {
    RefreshToken.destroy({
      where: { email_user: refreshTokenIns.email_user }
    });
    return res.status(403).send({ message: 'Token reused, login again' });
  }

  // if everything is ok
  const { token: newAcessToken, refreshToken: newRefreshToken }
      = createTokenPair(refreshTokenIns.email_user);

  const newRefreshTokenIns = RefreshToken.build({
    refreshToken: newRefreshToken,
    email_user: refreshTokenIns.email_user
  });

  try {
    refreshTokenIns.used = true;
    await refreshTokenIns.save();
    await newRefreshTokenIns.save(); // saving to the databse
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'fixthis' });
  }

  res.status(200).send({
    token: newAcessToken,
    refreshToken: newRefreshToken
  });
}

function createTokenPair(email) {
  const token = jwt.sign({
    email: email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour from now on
  }, process.env.JWT_SECRET);

  const refreshToken = jwt.sign({
    email: email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  }, process.env.JWT_REFRESH_SECRET);

  return { token: token, refreshToken: refreshToken };
}

module.exports = { register, login, refreshTokenRenew };
