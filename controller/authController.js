const db = require('./dbController');
const bcrypt = require("bcryptjs");

async function signup(req, res) {
  const { username, email, password } = req.body;

  res.send({
    message: `${username} sucessfull registred`,
    data: {
      username: username,
      email: email,
      password: await bcrypt.hash(password, 8)
    }
  });
};

module.exports = {signup};
