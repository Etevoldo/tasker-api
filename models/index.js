'use strict';

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    port: process.env.DB_PORT,
    host: 'localhost',
    dialect: 'mariadb',
    define: {
      timestamps: false
    }
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require('./user.js')(sequelize);
db.Task = require('./task.js')(sequelize);
db.RefreshToken = require('./refreshToken.js')(sequelize);

db.User.hasMany(db.Task, { foreignKey: 'id_user' });
db.Task.belongsTo(db.User, { foreignKey: 'id_user' });

module.exports = db;