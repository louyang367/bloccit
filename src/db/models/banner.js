'use strict';
module.exports = (sequelize, DataTypes) => {
  var Banner = sequelize.define('Banner', {
    source: DataTypes.STRING,
    description: DataTypes.STRING,
    topicId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "topic",
        key: "id",
        as: "topicId",
      }
    }
  });

  Banner.associate = function (models) {
    // associations can be defined here
    Banner.belongsTo(models.topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE",
    });
  };
  return Banner;
};