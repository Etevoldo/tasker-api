'use strict';
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class RefreshToken extends Model {}
  RefreshToken.init(
    {
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      email_user: DataTypes.STRING,
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0 // false
      }
    },
    {
      sequelize,
      modelName: 'RefreshToken',
    }
  );
  return RefreshToken;
}