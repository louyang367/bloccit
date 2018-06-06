'use strict';

module.exports = (sequelize, DataTypes) => {
  var Topic = sequelize.define('Topic', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    flairId: {
      type: DataTypes.INTEGER
    }
  }, {});

  Topic.associate = function (models) {
    Topic.hasMany(models.Post, {
      foreignKey: "topicId",
      as: "posts"
    });
    Topic.belongsTo(models.Flair, {
      foreignKey: "flairId",
      as: "flair"
    });
  };
  return Topic;
};