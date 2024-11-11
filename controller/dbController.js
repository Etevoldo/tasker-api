const mariadb = require('mariadb');

const connection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
};

async function queryUser(email, fields) {
  const conn = await mariadb.createConnection(connection);

  let query = 'SELECT * FROM users WHERE email = ?';

  if (fields) query = query.replace('*', fields.join(', '));

  try {
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
