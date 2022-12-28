'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SlackToTrello extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SlackToTrello.init({
    channelId: DataTypes.STRING,
    BoardId: DataTypes.STRING,
    organizationId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SlackToTrello',
  });
  return SlackToTrello;
};