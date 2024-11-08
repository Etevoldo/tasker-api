const mariadb = require('mariadb');

const connection = {
  host: 'localhost',
  user: 'root',
  database: 'tasker'
};

async function queryUser(username) {
  const conn = await mariadb.createConnection(connection);
  try {
    const query = 'SELECT * FROM users WHERE name = ?';
    const result = await conn.query(query, [username]);
    return result;
  } finally {
    conn.end();
  }
}

module.exports = { queryUser };
