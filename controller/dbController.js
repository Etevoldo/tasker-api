const mariadb = require('mariadb');

const connection = {
  host: 'localhost',
  user: 'root',
  database: 'tasker'
};

async function queryUser(email) {
  const conn = await mariadb.createConnection(connection);
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await conn.query(query, [email]);
    return result;
  } finally {
    conn.end();
  }
}

async function addUser(data) {
  const conn = await mariadb.createConnection(connection);
  try {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const result =
        await conn.query(query, [data.username, data.email, data.password]);
    return result;
  } catch(err) {
    console.error(err); // debug
    return -1;
  } finally {
    conn.end();
  }
}

module.exports = { queryUser, addUser };
