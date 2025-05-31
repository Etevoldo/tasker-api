'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize, User) => {
  class Task extends Model {}
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Task',
    }
  );
  return Task;
}