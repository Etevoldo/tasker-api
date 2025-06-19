'use strict';

const jwt = require('jsonwebtoken');
const mariadb = require('mariadb');

const connection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
};

async function createToken(email) {
  try {
    const rToken = jwt.sign({
      email: email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    }, process.env.JWT_REFRESH_SECRET);

    // store into db to revoke access in case of detection
    const conn = await mariadb.createConnection(connection);
    const query =
      'INSERT INTO refreshTokens (token, used, user) VALUES (?, ?, ?)';
    conn.query(query, [rToken, false, email]);

    return rToken;
  } catch (err) {
    console.error(err);
  }
}

async function getToken(rToken) {
  const conn = await mariadb.createConnection(connection);
  try {
    const query =
      'SELECT * FROM refreshTokens WHERE token = ?';

    // get a fresh decode version of the token
    const tokenTouple = (await conn.query(query, [rToken]))[0];

    return tokenTouple;
  } catch (err) {
    console.error(err);
  }
}

// automatic reusedection
async function delFamily(user) {
  const conn = await mariadb.createConnection(connection);
  try {
    const query =
      'DELETE FROM refreshTokens WHERE user = ?';

    await conn.query(query, [user]);
  } catch (err) {
    console.error(err);
  }
}

async function markUsed(rToken) {
  const conn = await mariadb.createConnection(connection);
  try {
    const query =
      'UPDATE refreshTokens SET used = true WHERE token = ?';

    await conn.query(query, [rToken]);
  } catch (err) {
    console.error(err);
  }
}
// TODO implement mark used function
module.exports = { createToken, getToken, delFamily, markUsed };
