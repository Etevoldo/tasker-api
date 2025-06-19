'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
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
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0 // false
      }
    },
    {
      sequelize,
      modelName: 'Task',
    }
  );
  return Task;
};