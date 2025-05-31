'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class RefreshToken extends Model {}
  RefreshToken.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      id_user: DataTypes.INTEGER,
      used: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'RefreshToken',
    }
  );
  return RefreshToken;
}